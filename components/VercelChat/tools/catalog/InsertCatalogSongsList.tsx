import { CatalogSongsResponse } from "@/lib/catalog/getCatalogSongs";

interface InsertCatalogSongsListProps {
  songs: CatalogSongsResponse["songs"];
}

/**
 * Displays a list of recently added catalog songs
 * Shows up to 5 songs with ISRC and catalog_id
 */
export default function InsertCatalogSongsList({
  songs,
}: InsertCatalogSongsListProps) {
  if (!songs || songs.length === 0) return null;

  return (
    <div className="mt-1">
      <div className="text-xs text-muted-foreground mb-2">
        Recently Processed ({Math.min(5, songs.length)} of {songs.length})
      </div>
      <div className="space-y-1">
        {songs.slice(0, 5).map((song, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-2 py-1.5 bg-muted/30 rounded text-xs"
          >
            <div className="flex-1 font-mono truncate">{song.isrc}</div>
            <div className="text-muted-foreground">→</div>
            <div className="text-muted-foreground font-mono text-[10px] truncate max-w-[120px]">
              {song.catalog_id}
            </div>
          </div>
        ))}
      </div>
      {songs.length > 5 && (
        <div className="text-xs text-muted-foreground mt-1 px-2">
          + {songs.length - 5} more songs
        </div>
      )}
    </div>
  );
}
