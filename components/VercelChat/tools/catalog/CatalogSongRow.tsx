import { useMemo, useState } from "react";
import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";
// import { formatArtists } from "@/lib/catalog/formatArtists";
import { useArtistCatalogFilter } from "@/providers/ArtistCatalogFilterProvider";

interface CatalogSongRowProps {
  song: CatalogSongsResponse["songs"][0];
}

const CatalogSongRow = ({ song }: CatalogSongRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { clearArtistFilter, setArtistFilter, currentArtistName } =
    useArtistCatalogFilter();
  const artistNames = useMemo(
    () => (song.artists || []).map((a) => a.name).filter(Boolean) as string[],
    [song.artists]
  );

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-2 px-3 max-w-[200px] truncate">{song.name || "—"}</td>
      <td className="py-2 px-3 max-w-[150px] truncate">
        {artistNames.map((name, idx) => {
          const isActive = currentArtistName && name === currentArtistName;
          return (
            <span key={`${name}-${idx}`}>
              <span
                className={`underline cursor-pointer ${
                  isActive ? "font-semibold" : ""
                }`}
                title={isActive ? "Clear artist filter" : "Filter by artist"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isActive) {
                    clearArtistFilter();
                  } else {
                    setArtistFilter(name);
                  }
                }}
              >
                {name}
              </span>
              {idx < artistNames.length - 1 ? ", " : null}
            </span>
          );
        })}
      </td>
      <td className="py-2 px-3 max-w-[150px] truncate">{song.album || "—"}</td>
      <td className="py-2 px-3 font-mono text-[10px]">{song.isrc}</td>
      <td
        className={`py-2 px-3 max-w-[200px] text-gray-600 cursor-pointer ${
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
