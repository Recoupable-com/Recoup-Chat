import getSpotifyFollowersExpected from "@/lib/evals/getSpotifyFollowersExpected";

const getSpotifyFollowersData = async () => {
  const artists = [
    "Gliiico",
    "Mac Miller",
    "Wiz Khalifa",
    "Mod Sun",
    "Julius Black",
  ];

  // Fetch fresh data for all artists
  const testCases = await Promise.all(
    artists.map(async (artist) => {
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
