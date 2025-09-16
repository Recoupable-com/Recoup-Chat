"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2, X } from "lucide-react";
import useArtists from "@/hooks/useArtists";
import { Separator } from "../ui/separator";
import useFileAccessGrant from "@/hooks/useFileAccessGrant";
import useUser from "@/hooks/useUser";
import HasAccessList from "@/components/Files/HasAccessList";
import ArtistAccessSelectorSkeleton from "@/components/Files/ArtistAccessSelectorSkeleton";
import type { ArtistAccess } from "@/components/Files/types";

type ArtistAccessSelectorProps = {
  disabled?: boolean;
  fileId: string;
  grantedBy: string;
};

export default function ArtistAccessSelector({
  disabled,
  fileId,
  grantedBy,
}: ArtistAccessSelectorProps) {
  const { artists } = useArtists();
  const { userData } = useUser();
  const accountId = userData?.account_id;

  const { selected, add, remove, onGrant, isSavingAccess, accessData, isUiLoading, alreadyHasAccessIds } = useFileAccessGrant({
    fileId,
    grantedBy,
    invalidateKeys: [["file-access-artists", fileId, accountId]],
  });

  return (
    <div className="space-y-2">
      <Separator />
      <div className="text-xs text-muted-foreground">Share with artists</div>
      {isUiLoading ? <ArtistAccessSelectorSkeleton /> : null}
      {/* Access list now merged below */}
      {!isUiLoading && (
        <>
          <div className="flex flex-wrap gap-1">
            {selected.map((id) => {
              const a = artists.find((x) => x.account_id === id);
              return (
                <Badge key={id} variant="secondary" className="pr-1">
                  {a?.name || id}
                  <button
                    className="ml-1"
                    onClick={() => remove(id)}
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
                      onClick={() => add(a.account_id)}
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
              {isSavingAccess && <Loader2 className="ml-1 h-3 w-3 animate-spin" />}
              Grant access
            </Button>
          </div>
        </>
      )}
      {!isUiLoading && accessData?.data?.artists?.length ? (
        <HasAccessList artists={accessData.data.artists as ArtistAccess[]} fileId={fileId} accountId={accountId} />
      ) : null}
    </div>
  );
}
