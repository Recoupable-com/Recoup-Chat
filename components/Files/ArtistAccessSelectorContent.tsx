"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader, X } from "lucide-react";
import useArtists from "@/hooks/useArtists";

type ArtistAccessSelectorContentProps = {
  selected: string[];
  alreadyHasAccessIds: string[];
  disabled?: boolean;
  isSavingAccess: boolean;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onGrant: () => void;
};

export default function ArtistAccessSelectorContent({
  selected,
  alreadyHasAccessIds,
  disabled,
  isSavingAccess,
  onAdd,
  onRemove,
  onGrant,
}: ArtistAccessSelectorContentProps) {
  const { artists } = useArtists();

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {selected.map((id) => {
          const a = artists.find((x) => x.account_id === id);
          return (
            <Badge key={id} variant="secondary" className="pr-1">
              {a?.name || id}
              <button
                className="ml-1"
                onClick={() => onRemove(id)}
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={disabled}>
              Add artist <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {artists
              .filter((a) => !selected.includes(a.account_id) && !alreadyHasAccessIds.includes(a.account_id))
              .map((a) => (
                <DropdownMenuItem
                  key={a.account_id}
                  onClick={() => onAdd(a.account_id)}
                >
                  {a.image ? (
                    <span className="mr-2 inline-block h-4 w-4 rounded-full bg-muted" />
                  ) : null}
                  <span className="truncate">{a.name || a.account_id}</span>
                </DropdownMenuItem>
              ))}
            {artists.filter((a) => !selected.includes(a.account_id) && !alreadyHasAccessIds.includes(a.account_id)).length ===
              0 && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                No more artists
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          size="sm"
          disabled={disabled || !selected.length || isSavingAccess}
          onClick={() => onGrant()}
        >
          {isSavingAccess && <Loader className="ml-1 h-3 w-3 animate-spin" />}
          Grant access
        </Button>
      </div>
    </>
  );
}
