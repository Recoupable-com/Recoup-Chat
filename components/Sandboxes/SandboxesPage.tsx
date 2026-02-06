"use client";

import { Loader } from "lucide-react";
import SandboxCreateSection from "@/components/Sandboxes/SandboxCreateSection";
import SandboxList from "@/components/Sandboxes/SandboxList";
import SandboxFileTree from "@/components/Sandboxes/SandboxFileTree";
import useSandboxes from "@/hooks/useSandboxes";

export default function SandboxesPage() {
  const { sandboxes, filetree, isLoading, error, refetch } = useSandboxes();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-semibold">Sandboxes</h1>
      <SandboxCreateSection onSuccess={refetch} />
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader className="h-4 w-4 animate-spin" />
          <span>Loading sandboxes...</span>
        </div>
      ) : error ? (
        <div className="text-destructive">
          <p>Failed to load sandboxes</p>
          <button
            onClick={() => refetch()}
            className="text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <SandboxList sandboxes={sandboxes} />
          <SandboxFileTree filetree={filetree} />
        </>
      )}
    </div>
  );
}
