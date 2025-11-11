import { useState } from "react";
import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";
import { formatArtists } from "@/lib/catalog/formatArtists";

interface CatalogSongRowProps {
  song: CatalogSongsResponse["songs"][0];
}

const CatalogSongRow = ({ song }: CatalogSongRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <tr className="border-b border-border hover:bg-muted >
      <td className="py-2 px-3 max-w-[200px] truncate">{song.name || "—"}</td>
      <td className="py-2 px-3 max-w-[150px] truncate">
        {formatArtists(song.artists)}
      </td>
      <td className="py-2 px-3 max-w-[150px] truncate">{song.album || "—"}</td>
      <td className="py-2 px-3 font-mono text-[10px]">{song.isrc}</td>
      <td
        className={`py-2 px-3 max-w-[200px] text-muted-foreground cursor-pointer ${
          isExpanded ? "" : "truncate"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? "Click to collapse" : "Click to expand"}
      >
        {song.notes || "—"}
      </td>
    </tr>
  );
};

export default CatalogSongRow;
