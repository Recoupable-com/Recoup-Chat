import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";

interface CatalogSongRowProps {
  song: CatalogSongsResponse["songs"][0];
}

const formatArtists = (
  artists: CatalogSongsResponse["songs"][0]["artists"]
) => {
  if (!artists || artists.length === 0) return "—";
  return artists.map((artist) => artist.name).join(", ");
};

const CatalogSongRow = ({ song }: CatalogSongRowProps) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-2 px-3 max-w-[200px] truncate">{song.name || "—"}</td>
      <td className="py-2 px-3 max-w-[150px] truncate">
        {formatArtists(song.artists)}
      </td>
      <td className="py-2 px-3 max-w-[150px] truncate">{song.album || "—"}</td>
      <td className="py-2 px-3 font-mono text-[10px]">{song.isrc}</td>
      <td className="py-2 px-3 max-w-[200px] truncate text-gray-600">
        {song.notes || "—"}
      </td>
    </tr>
  );
};

export default CatalogSongRow;
