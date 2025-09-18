"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface AgentCreatorProps {
  creatorId: string | null;
  className?: string;
}

type CreatorResponse = {
  creator?: {
    name?: string | null;
    image?: string | null;
    is_admin?: boolean | null;
  } | null;
};

const AgentCreator = ({ creatorId, className }: AgentCreatorProps) => {
  const { data } = useQuery<CreatorResponse>({
    queryKey: ["agent-creator", creatorId],
    queryFn: async () => {
      const res = await fetch(`/api/agent-creator?creatorId=${creatorId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      return (await res.json()) as CreatorResponse;
    },
    enabled: !!creatorId,
    staleTime: 60_000,
  });

  const isAdmin = !!data?.creator?.is_admin;
  const imageUrl = data?.creator?.image || "";
  const name = data?.creator?.name || "";

  if (!creatorId || isAdmin) {
    return (
      <div className={className}>
        <Image
          src="/brand-logos/recoup-v2.png"
          alt="Recoup"
          width={18}
          height={18}
          className="w-auto rounded-full"
          priority={false}
        />
      </div>
    );
  }

  if (!imageUrl) return null;

  return (
    <div className={className}>
      <Avatar className="h-[24px] w-[24px] rounded-full">
        <AvatarImage src={imageUrl} alt={name || "Creator"} />
      </Avatar>
    </div>
  );
};

export default AgentCreator;


