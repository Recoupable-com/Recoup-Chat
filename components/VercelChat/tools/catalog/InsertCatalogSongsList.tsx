import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";

interface InsertCatalogSongsListProps {
  songs: CatalogSongsResponse["songs"];
}

/**
 * Displays catalog songs in a table format
 * Shows full metadata: title, artist, album, ISRC, and notes
 */
export default function InsertCatalogSongsList({
  songs,
}: InsertCatalogSongsListProps) {
  if (!songs || songs.length === 0) return null;

  const formatArtists = (
    artists: CatalogSongsResponse["songs"][0]["artists"]
  ) => {
    if (!artists || artists.length === 0) return "—";
    return artists.map((artist) => artist.name).join(", ");
  };

  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-700">
              Title
            </th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">
              Artist
            </th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">
              Album
            </th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">
              ISRC
            </th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr
              key={song.isrc || index}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-2 px-3 max-w-[200px] truncate">
                {song.name || "—"}
              </td>
              <td className="py-2 px-3 max-w-[150px] truncate">
                {formatArtists(song.artists)}
              </td>
              <td className="py-2 px-3 max-w-[150px] truncate">
                {song.album || "—"}
              </td>
              <td className="py-2 px-3 font-mono text-[10px]">{song.isrc}</td>
              <td className="py-2 px-3 max-w-[200px] truncate text-gray-600">
                {song.lyrics || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {songs.length > 0 && (
        <div className="text-xs text-muted-foreground mt-2 px-3">
          Showing {songs.length} song{songs.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
