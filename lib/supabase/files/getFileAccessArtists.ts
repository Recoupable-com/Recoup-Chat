import supabase from "../serverClient";

export const getFileAccessArtists = async ({
  fileId,
  accountId,
}: {
  fileId: string;
  accountId: string;
}) => {
  try {
    // Validate that the file exists
    const { data: fileExists, error: fileError } = await supabase
      .from("files")
      .select("id")
      .eq("id", fileId)
      .single();

    if (fileError || !fileExists) {
      return { success: false, error: "File not found" };
    }

    // Validate that the account exists
    const { data: accountExists, error: accountError } = await supabase
      .from("accounts")
      .select("id")
      .eq("id", accountId)
      .single();

    if (accountError || !accountExists) {
      return { success: false, error: "Account not found" };
    }

    // Get artists who have access to the file
    // Join file_access with account_artist_ids to get artists under the user account
    const { data: fileAccessData, error: accessError } = await supabase
      .from("file_access")
      .select(`
        artist_account_id,
        scope,
        created_at,
        expires_at,
        revoked_at
      `)
      .eq("file_id", fileId)
      .not("artist_account_id", "is", null)
      .is("revoked_at", null); // Only active access grants

    if (accessError) {
      console.error("Error fetching file access:", accessError);
      return { success: false, error: "Failed to fetch file access data" };
    }

    // Filter artists that belong to the requesting user's account
    const { data: userArtists, error: userArtistsError } = await supabase
      .from("account_artist_ids")
      .select("artist_id")
      .eq("account_id", accountId);

    if (userArtistsError) {
      console.error("Error fetching user artists:", userArtistsError);
      return { success: false, error: "Failed to fetch user artists" };
    }

    const userArtistIds = new Set(userArtists?.map(ua => ua.artist_id) || []);

    // Filter file access to only include artists under the user's account
    const accessibleArtists = fileAccessData?.filter(access => 
      access.artist_account_id && userArtistIds.has(access.artist_account_id)
    ) || [];

    // Get artist details for the accessible artists
    const artistIds = accessibleArtists.map(access => access.artist_account_id);
    
    if (artistIds.length === 0) {
      return {
        success: true,
        artists: [],
        message: "No artists under this account have access to this file"
      };
    }

    const { data: artistDetails, error: artistDetailsError } = await supabase
      .from("accounts")
      .select("id, name, account_emails(email)")
      .in("id", artistIds);

    if (artistDetailsError) {
      console.error("Error fetching artist details:", artistDetailsError);
      return { success: false, error: "Failed to fetch artist details" };
    }

    // Combine access data with artist details
    const artistsWithAccess = accessibleArtists.map(access => {
      const artistDetail = artistDetails?.find(artist => artist.id === access.artist_account_id) as
        | { id: string; name?: string | null; account_emails?: { email?: string | null }[] }
        | undefined;

      const name = artistDetail?.name ?? null;
      const email = artistDetail?.account_emails?.[0]?.email ?? null;

      return {
        artistId: access.artist_account_id,
        scope: access.scope,
        grantedAt: access.created_at,
        expiresAt: access.expires_at,
        artistName: name || email || "Unknown",
        artistEmail: email,
      };
    });

    return {
      success: true,
      artists: artistsWithAccess,
      count: artistsWithAccess.length
    };

  } catch (error) {
    console.error("Error in getFileAccessArtists:", error);
    return { success: false, error: "Internal server error" };
  }
};
