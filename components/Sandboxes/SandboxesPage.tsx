"use client";

import { useState } from "react";
import { Loader } from "lucide-react";
import SandboxCreateSection from "@/components/Sandboxes/SandboxCreateSection";
import SandboxList from "@/components/Sandboxes/SandboxList";
import useSandboxes from "@/hooks/useSandboxes";
import type { Sandbox } from "@/lib/sandboxes/createSandbox";

export default function SandboxesPage() {
  const { sandboxes: historySandboxes, isLoading, error, refetch } = useSandboxes();
  const [newSandboxes, setNewSandboxes] = useState<Sandbox[]>([]);

  const handleSandboxCreated = (createdSandboxes: Sandbox[]) => {
    setNewSandboxes((prev) => [...createdSandboxes, ...prev]);
  };

  // Combine newly created sandboxes with history, avoiding duplicates
  const allSandboxes = [
    ...newSandboxes,
    ...historySandboxes.filter(
      (h) => !newSandboxes.some((n) => n.sandboxId === h.sandboxId)
    ),
  ];

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-semibold">Sandboxes</h1>
      <SandboxCreateSection onSandboxCreated={handleSandboxCreated} />
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
        <SandboxList sandboxes={allSandboxes} />
      )}
    </div>
  );
}
