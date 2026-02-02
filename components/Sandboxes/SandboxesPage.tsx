"use client";

import { useState } from "react";
import SandboxCreateSection from "@/components/Sandboxes/SandboxCreateSection";
import type { Sandbox } from "@/lib/sandbox/createSandbox";

export default function SandboxesPage() {
  const [sandboxes, setSandboxes] = useState<Sandbox[]>([]);

  const handleSandboxCreated = (newSandboxes: Sandbox[]) => {
    setSandboxes((prev) => [...newSandboxes, ...prev]);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-semibold">Sandboxes</h1>

      <SandboxCreateSection onSandboxCreated={handleSandboxCreated} />

      {sandboxes.length > 0 && (
        <div className="w-full max-w-md space-y-2">
          <h2 className="text-lg font-medium">Created Sandboxes</h2>
          <div className="space-y-2">
            {sandboxes.map((sandbox) => (
              <div
                key={sandbox.sandboxId}
                className="rounded-lg border border-border p-3"
              >
                <p className="text-sm font-medium">{sandbox.sandboxId}</p>
                <p className="text-xs text-muted-foreground">
                  Status: {sandbox.sandboxStatus}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
