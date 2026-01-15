import { NEW_API_BASE_URL } from "@/lib/consts";

interface CreateArtistParams {
  name: string;
  accessToken: string;
  accountId?: string;
  organizationId?: string;
}

const createArtist = async ({
  name,
  accessToken,
  accountId,
  organizationId,
}: CreateArtistParams) => {
  try {
    const response = await fetch(`${NEW_API_BASE_URL}/api/artists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name,
        account_id: accountId,
        organization_id: organizationId,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create artist");
    }

    return data.artist;
  } catch (error) {
    return null;
  }
};

export default createArtist;
