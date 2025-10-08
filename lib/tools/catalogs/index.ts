import getCatalogsTool from "./getCatalogs";
import getCatalogSongsTool from "./getCatalogSongs";
import insertCatalogSongsTool from "./insertCatalogSongs";

const catalogTools = {
  select_catalogs: getCatalogsTool,
  select_catalog_songs: getCatalogSongsTool,
  insert_catalog_songs: insertCatalogSongsTool,
};

export default catalogTools;
