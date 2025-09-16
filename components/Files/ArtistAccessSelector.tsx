"use client";

import { Separator } from "../ui/separator";
import useFileAccessGrant from "@/hooks/useFileAccessGrant";
import useUser from "@/hooks/useUser";
import HasAccessList from "@/components/Files/HasAccessList";
import ArtistAccessSelectorSkeleton from "@/components/Files/ArtistAccessSelectorSkeleton";
import ArtistAccessSelectorContent from "@/components/Files/ArtistAccessSelectorContent";
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
        <ArtistAccessSelectorContent
          selected={selected}
          alreadyHasAccessIds={alreadyHasAccessIds}
          disabled={disabled}
          isSavingAccess={isSavingAccess}
          onAdd={add}
          onRemove={remove}
          onGrant={onGrant}
        />
      )}
      {!isUiLoading && accessData?.data?.artists?.length ? (
        <HasAccessList artists={accessData.data.artists as ArtistAccess[]} fileId={fileId} accountId={accountId} />
      ) : null}
    </div>
  );
}
