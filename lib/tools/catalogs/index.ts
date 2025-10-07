import getCatalogsTool from "./getCatalogs";
import getCatalogSongsTool from "./getCatalogSongs";

const catalogTools = {
  select_catalogs: getCatalogsTool,
  select_catalog_songs: getCatalogSongsTool,
};

export default catalogTools;
