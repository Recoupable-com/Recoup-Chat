import { getCatalogs } from "@/lib/catalog/getCatalogs";
import { getCatalogSongs } from "@/lib/catalog/getCatalogSongs";
import { EVAL_ACCOUNT_ID } from "@/lib/consts";

async function getCatalogSongsCountExpected() {
  try {
    const catalogsData = await getCatalogs(EVAL_ACCOUNT_ID);

    if (!catalogsData.catalogs || catalogsData.catalogs.length === 0) {
      throw new Error("No catalogs found for account");
    }

    const firstCatalog = catalogsData.catalogs[0];
    const catalogSongs = await getCatalogSongs(firstCatalog.id);

    const count = catalogSongs.pagination.total_count;
    const formattedCount = count.toLocaleString();
    const expected = `The catalog "${firstCatalog.name}" (id: ${firstCatalog.id}) contains ${formattedCount} songs.`;

    return {
      catalogId: firstCatalog.id,
      catalogName: firstCatalog.name,
      count,
      expected,
    };
  } catch (error) {
    console.error("Error fetching catalog songs count:", error);
    const fallbackExpected =
      "Catalog song count data could not be retrieved at this time. Please try again later.";
    return {
      catalogId: "",
      catalogName: "",
      count: 0,
      expected: fallbackExpected,
    };
  }
}

export default getCatalogSongsCountExpected;
