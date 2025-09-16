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
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import RevokeAccessDialog from "@/components/Files/RevokeAccessDialog";

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
  type ArtistAccess = {
    artistId: string;
    scope: "read_only" | "admin";
    grantedAt: string;
    expiresAt: string | null;
    artistName?: string | null;
    artistEmail?: string | null;
  };
  type AccessArtistsResponse = {
    success: boolean;
    data?: { artists: ArtistAccess[]; count: number; fileId: string; accountId: string };
  };

  const { data: accessData, isLoading: isAccessLoading } = useQuery<AccessArtistsResponse | null>({
    queryKey: ["file-access-artists", fileId, accountId],
    queryFn: async () => {
      if (!accountId) return null;
      const res = await fetch(`/api/files/access-artists?fileId=${encodeURIComponent(fileId)}&accountId=${encodeURIComponent(accountId)}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: Boolean(fileId && accountId),
    staleTime: 30_000,
  });
  // Treat UI as loading until we have an accountId and the query has resolved
  const isUiLoading = !accountId || isAccessLoading;
  const alreadyHasAccessIds: string[] = (accessData?.data?.artists || []).map((a: ArtistAccess) => a.artistId);
  const { selected, add, remove, onGrant, isSavingAccess } = useFileAccessGrant({
    fileId,
    grantedBy,
    invalidateKeys: [["file-access-artists", fileId, accountId]],
  });

  return (
    <div className="space-y-2">
      <Separator />
      <div className="text-xs text-muted-foreground">Share with artists</div>
      {isUiLoading ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ) : null}
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
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Has access</div>
          <div className="flex flex-wrap gap-1">
            {accessData.data.artists.map((a: ArtistAccess) => (
              <Badge key={a.artistId} variant="secondary" className="pr-1">
                {a.artistName || a.artistEmail || a.artistId}
                <RevokeAccessDialog
                  fileId={fileId}
                  artistId={a.artistId}
                  accountId={accountId}
                  artistLabel={a.artistName || a.artistEmail || a.artistId}
                >
                  <button className="ml-1" aria-label="Revoke">
                    <X className="h-3 w-3" />
                  </button>
                </RevokeAccessDialog>
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
