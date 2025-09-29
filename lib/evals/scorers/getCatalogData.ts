export async function getCatalogData(): Promise<string> {
  if (!process.env.MUSIC_CATALOG_URL) {
    throw new Error("MUSIC_CATALOG_URL environment variable is required");
  }

  const response = await fetch(process.env.MUSIC_CATALOG_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch catalog: ${response.status}`);
  }

  return response.text();
}
