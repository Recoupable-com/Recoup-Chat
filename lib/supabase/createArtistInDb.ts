import createAccount from "./accounts/createAccount";
import createAccountInfo from "./artist/createAccountInfo";
import getArtistById from "./artist/getArtistById";
import associateArtistWithAccount from "./artist/associateArtistWithAccount";
import type { AccountType } from "@/types/AccountType";

/**
 * Create a new account in the database and associate it with a user account
 * @param name Name of the account to create
 * @param account_id ID of the user account that will have access
 * @param accountType Type of account: 'artist', 'workspace', etc. Defaults to 'artist'
 * @returns Created account object or null if creation failed
 */
export async function createArtistInDb(
  name: string,
  account_id: string,
  accountType: AccountType = "artist"
) {
  try {
    // Step 1: Create the account with specified type
    const account = await createAccount(name, accountType);
    if (!account) return null;

    // Step 2: Create account info for the account
    const infoCreated = await createAccountInfo(account.id);
    if (!infoCreated) return null;

    // Step 3: Get the full account data
    const artist = await getArtistById(account.id);
    if (!artist) return null;

    // Step 4: Associate the account with the user
    const associated = await associateArtistWithAccount(account_id, account.id);
    if (!associated) return null;

    // Build return object by explicitly picking fields
    // This avoids fragile spread-order dependencies where account_info.id
    // could accidentally overwrite accounts.id
    const accountInfo = artist.account_info?.[0];
    
    return {
      // Core account fields from accounts table
      id: artist.id,
      account_id: artist.id,  // Alias used by ArtistRecord type
      name: artist.name,
      account_type: artist.account_type,
      created_at: artist.created_at,
      updated_at: artist.updated_at,
      
      // Profile fields from account_info table (explicitly picked, not spread)
      image: accountInfo?.image ?? null,
      instruction: accountInfo?.instruction ?? null,
      knowledges: accountInfo?.knowledges ?? null,
      label: accountInfo?.label ?? null,
      organization: accountInfo?.organization ?? null,
      company_name: accountInfo?.company_name ?? null,
      job_title: accountInfo?.job_title ?? null,
      role_type: accountInfo?.role_type ?? null,
      onboarding_status: accountInfo?.onboarding_status ?? null,
      onboarding_data: accountInfo?.onboarding_data ?? null,
      
      // Related data arrays
      account_info: artist.account_info,
      account_socials: artist.account_socials,
    };
  } catch (error) {
    console.error("Unexpected error creating artist:", error);
    return null;
  }
}

export default createArtistInDb;
