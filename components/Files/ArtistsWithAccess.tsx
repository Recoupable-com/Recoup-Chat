"use client";

import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

type ArtistsWithAccessProps = {
  fileId: string;
  accountId: string;
};

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
  data?: {
    artists: ArtistAccess[];
    count: number;
    fileId: string;
    accountId: string;
  };
  message?: string;
  error?: string;
};

const fetchArtistsWithAccess = async (
  fileId: string,
  accountId: string
) => {
  const res = await fetch(
    `/api/files/access-artists?fileId=${encodeURIComponent(
      fileId
    )}&accountId=${encodeURIComponent(accountId)}`
  );
  if (!res.ok) throw new Error("Failed to load file access");
  const json: AccessArtistsResponse = await res.json();
  return json;
};

export default function ArtistsWithAccess({
  fileId,
  accountId,
}: ArtistsWithAccessProps) {
  const { data, isLoading } = useQuery<AccessArtistsResponse>({
    queryKey: ["file-access-artists", fileId, accountId],
    queryFn: () => fetchArtistsWithAccess(fileId, accountId),
    enabled: Boolean(fileId && accountId),
    staleTime: 30_000,
  });

  if (!fileId || !accountId) return null;

  const artists: ArtistAccess[] = data?.data?.artists ?? [];
  if (isLoading) return null;
  if (artists.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">Already has access</div>
      <div className="flex flex-wrap gap-1">
        {artists.map((a) => (
          <Badge key={a.artistId} variant="secondary">
            {a.artistName || a.artistEmail || a.artistId}
          </Badge>
        ))}
      </div>
    </div>
  );
}


