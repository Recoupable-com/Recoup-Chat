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

    // Return formatted data
    // IMPORTANT: id and account_id must come AFTER spreading account_info
    // because account_info has its own id and account_id fields that would overwrite
    return {
      ...artist,
      ...artist.account_info[0],
      id: artist.id,          // The workspace's accounts.id (not account_info.id)
      account_id: artist.id,  // The workspace's own ID, not the foreign key
    };
  } catch (error) {
    console.error("Unexpected error creating artist:", error);
    return null;
  }
}

export default createArtistInDb;
