"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function useFilesPath(base: string) {
  const params = useSearchParams();
  const router = useRouter();
  const path = params.get("path") || base;

  const normalized = useMemo(() => (path.endsWith("/") ? path : path + "/"), [path]);

  const goTo = (next: string) => {
    const p = next.endsWith("/") ? next : next + "/";
    const usp = new URLSearchParams(Array.from(params.entries()));
    usp.set("path", p);
    router.push(`?${usp.toString()}`);
  };

  const join = (segment: string) => `${normalized}${segment}`;

  const parent = () => {
    const parts = normalized.split("/").filter(Boolean);
    if (parts.length <= 3) return normalized; // files/{owner}/{artist}/
    const up = parts.slice(0, -1).join("/") + "/";
    return up.startsWith("/") ? up.slice(1) : up;
  };

  return { path: normalized, goTo, join, parent };
}


