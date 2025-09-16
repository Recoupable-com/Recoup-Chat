import supabase from "../serverClient";

export const grantFileAccess = async ({
  fileId,
  artistIds,
  grantedBy,
  scope = "read_only",
}: {
  fileId: string;
  artistIds: string[];
  grantedBy: string;
  scope?: "read_only" | "admin";
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

    // Validate that the grantedBy user exists
    const { data: userExists, error: userError } = await supabase
      .from("accounts")
      .select("id")
      .eq("id", grantedBy)
      .single();

    if (userError || !userExists) {
      return { success: false, error: "Invalid user" };
    }

    const results = {
      successful: [] as string[],
      alreadyExists: [] as string[],
      failed: [] as string[],
    };

    for (const artistId of artistIds) {
      try {
        // Validate that the artist exists
        const { data: artistExists, error: artistError } = await supabase
          .from("accounts")
          .select("id")
          .eq("id", artistId)
          .single();

        if (artistError || !artistExists) {
          results.failed.push(artistId);
          continue;
        }

        // Check if the artist already has access
        const { data: existingAccess } = await supabase
          .from("file_access")
          .select("*")
          .eq("file_id", fileId)
          .eq("artist_account_id", artistId)
          .maybeSingle();

        if (existingAccess) {
          results.alreadyExists.push(artistId);
          continue;
        }

        // Grant access
        const { error: insertError } = await supabase
          .from("file_access")
          .insert({
            file_id: fileId,
            artist_account_id: artistId,
            granted_by: grantedBy,
            scope,
          });

        if (insertError) {
          console.error(`Failed to grant access to artist ${artistId}:`, insertError);
          results.failed.push(artistId);
        } else {
          results.successful.push(artistId);
        }
      } catch (error) {
        console.error(`Error processing artist ${artistId}:`, error);
        results.failed.push(artistId);
      }
    }

    return {
      success: results.successful.length > 0,
      results,
    };
  } catch (error) {
    console.error("Error in grantFileAccess:", error);
    return { success: false, error: "Internal server error" };
  }
};
