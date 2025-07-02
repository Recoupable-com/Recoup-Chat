import getAccountById from "@/lib/supabase/accounts/getAccountById";
import updateAccount from "@/lib/supabase/accounts/updateAccount";
import getAccountInfoById from "@/lib/supabase/accountInfo/getAccountInfoById";
import updateAccountInfo from "@/lib/supabase/accountInfo/updateAccountInfo";
import insertAccountInfo from "@/lib/supabase/accountInfo/insertAccountInfo";
import getAccountByEmail from "@/lib/supabase/accounts/getAccountByEmail";
import insertAccount from "@/lib/supabase/accounts/insertAccount";
import insertAccountArtistId from "@/lib/supabase/accountArtistIds/insertAccountArtistId";
import type { Tables } from "@/types/database.types";

export type Knowledge = {
  url: string;
  name: string;
  type: string;
};

export type ArtistProfile = Tables<"accounts"> & Tables<"account_info">;

const updateArtistProfile = async (
  artistId: string,
  email: string,
  image: string,
  name: string,
  instruction: string,
  label: string,
  knowledges: Knowledge[] | null
): Promise<ArtistProfile> => {
  let accountId = artistId;
  if (artistId) {
    // Fetch current account and account_info
    const currentAccount = await getAccountById(artistId);
    if (!currentAccount) throw Error("artist does not exist.");

    // Only update fields that are non-empty
    const accountUpdate: Partial<typeof currentAccount> = {};
    if (name) accountUpdate.name = name;
    if (Object.keys(accountUpdate).length > 0) {
      await updateAccount(artistId, accountUpdate);
    }

    const account_info = await getAccountInfoById(artistId);
    if (account_info) {
      // Only update fields that are non-empty, otherwise keep existing
      const infoUpdate: Partial<typeof account_info> = {};
      infoUpdate.image = image || account_info.image;
      infoUpdate.instruction = instruction || account_info.instruction;
      
      // Append new knowledge files to existing ones instead of replacing them
      if (knowledges && knowledges.length > 0) {
        // Ensure proper typing by casting to Knowledge array
        const existingKnowledges = (account_info.knowledges || []) as Knowledge[];
        
        // Filter out duplicates by URL to prevent adding the same file twice
        const newKnowledges = knowledges.filter(
          newFile => !existingKnowledges.some(existingFile => existingFile.url === newFile.url)
        );
        
        infoUpdate.knowledges = [...existingKnowledges, ...newKnowledges];
      } else {
        infoUpdate.knowledges = account_info.knowledges;
      }
      
      infoUpdate.label = label || account_info.label;
      await updateAccountInfo(artistId, infoUpdate);
    } else {
      await insertAccountInfo({
        image,
        instruction,
        knowledges,
        label,
        account_id: artistId,
      });
    }
  } else {
    const emailRecord = await getAccountByEmail(email);
    if (!emailRecord) throw Error("account email does not exist.");
    const newArtistAccount = await insertAccount({ name });
    if (!newArtistAccount) throw Error("failed to create new artist account");
    accountId = newArtistAccount.id;
    await insertAccountArtistId({
      account_id: emailRecord.account_id,
      artist_id: newArtistAccount.id,
    });
    await insertAccountInfo({
      image,
      instruction,
      knowledges,
      label,
      account_id: newArtistAccount.id,
    });
  }
  // Fetch and return the latest account and account_info
  const [account, accountInfo] = await Promise.all([
    getAccountById(accountId),
    getAccountInfoById(accountId),
  ]);
  if (!account || !accountInfo) {
    throw new Error("Failed to fetch updated artist profile");
  }
  return {
    ...accountInfo,
    ...account,
  };
};

export default updateArtistProfile;
