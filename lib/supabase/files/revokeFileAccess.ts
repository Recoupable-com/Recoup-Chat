import supabase from "../serverClient";

export const revokeFileAccess = async ({
  fileId,
  artistId,
}: {
  fileId: string;
  artistId: string;
}) => {
  try {
    // Ensure record exists
    const { data: existing, error: existingError } = await supabase
      .from("file_access")
      .select("id")
      .eq("file_id", fileId)
      .eq("artist_account_id", artistId)
      .maybeSingle();

    if (existingError) {
      return { success: false, error: "Failed to verify existing access" };
    }

    if (!existing) {
      return { success: false, error: "Access not found" };
    }

    // Hard delete the grant (simpler semantics for UI)
    const { error: deleteError } = await supabase
      .from("file_access")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      return { success: false, error: "Failed to revoke access" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in revokeFileAccess:", error);
    return { success: false, error: "Internal server error" };
  }
};

export default revokeFileAccess;


