"use client";

import { Badge } from "@/components/ui/badge";
import RevokeAccessDialog from "@/components/Files/RevokeAccessDialog";
import type { ArtistAccess } from "@/components/Files/types";

type HasAccessListProps = {
  artists: ArtistAccess[];
  fileId: string;
  accountId?: string;
};

export default function HasAccessList({ artists, fileId, accountId }: HasAccessListProps) {
  if (!artists?.length) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">Has access</div>
      <div className="flex flex-wrap gap-1">
        {artists.map((a) => (
          <Badge key={a.artistId} variant="secondary" className="pr-1">
            {a.artistName || a.artistEmail || a.artistId}
            <RevokeAccessDialog
              fileId={fileId}
              artistId={a.artistId}
              accountId={accountId}
              artistLabel={a.artistName || a.artistEmail || a.artistId}
            >
              <button className="ml-1" aria-label="Revoke">
                {/* icon is provided by parent import context if needed */}
                ✕
              </button>
            </RevokeAccessDialog>
          </Badge>
        ))}
      </div>
    </div>
  );
}


