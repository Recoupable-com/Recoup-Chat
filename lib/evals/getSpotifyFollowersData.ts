import getSpotifyFollowersExpected from "@/lib/evals/getSpotifyFollowersExpected";
import { EVAL_ARTISTS } from "@/lib/consts";

const getSpotifyFollowersData = async () => {
  const testCases = await Promise.all(
    EVAL_ARTISTS.map(async (artist) => {
      const { expected } = await getSpotifyFollowersExpected(artist);
      return {
        input: `how many total followers does ${artist} have on Spotify`,
        expected,
        metadata: {
          artist,
          platform: "Spotify",
          expected_tool_usage: true,
          data_type: "spotify_followers",
        },
      };
    })
  );

  return testCases;
};

export default getSpotifyFollowersData;
