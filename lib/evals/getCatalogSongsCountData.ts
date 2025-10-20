import getCatalogSongsCountExpected from "@/lib/evals/getCatalogSongsCountExpected";

const getCatalogSongsCountData = async () => {
  const { expected, catalogName, count } = await getCatalogSongsCountExpected();

  const testCases = [
    {
      input: `How many songs are in my catalog?`,
      expected,
      metadata: {
        catalogName,
        count,
        expected_tool_usage: true,
        data_type: "catalog_songs_count",
      },
    },
    {
      input: `What's the total count of songs in my music catalog?`,
      expected,
      metadata: {
        catalogName,
        count,
        expected_tool_usage: true,
        data_type: "catalog_songs_count",
      },
    },
    {
      input: `Get the number of songs in my catalog`,
      expected,
      metadata: {
        catalogName,
        count,
        expected_tool_usage: true,
        data_type: "catalog_songs_count",
      },
    },
  ];

  return testCases;
};

export default getCatalogSongsCountData;
