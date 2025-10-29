import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";
import CatalogSongRow from "./CatalogSongRow";

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
            <CatalogSongRow key={song.isrc || index} song={song} />
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
