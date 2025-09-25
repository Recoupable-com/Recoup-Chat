import { getSpotifyFollowers } from "@/lib/spotify/getSpotifyFollowers";

async function getSpotifyFollowersExpected(artist: string) {
  try {
    const followerCount = await getSpotifyFollowers(artist);
    const expected = `${artist} has ${followerCount} followers on Spotify.`;

    const data = { followerCount, expected };
    return data;
  } catch (error) {
    console.error(`Error fetching Spotify followers for "${artist}":`, error);
    const fallbackExpected = `${artist} has follower data that could not be retrieved at this time. Please try again later.`;
    const data = { followerCount: 0, expected: fallbackExpected };
    return data;
  }
}

export default getSpotifyFollowersExpected;
