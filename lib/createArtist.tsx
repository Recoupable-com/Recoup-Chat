import { NEW_API_BASE_URL } from "@/lib/consts";

const createArtist = async (name: string, account_id: string) => {
  try {
    const response = await fetch(
      `${NEW_API_BASE_URL}/api/artist/create?name=${encodeURIComponent(name)}&account_id=${account_id}`,
    );
    const data = await response.json();

    return data.artist;
  } catch (error) {
    return null;
  }
};

export default createArtist;
