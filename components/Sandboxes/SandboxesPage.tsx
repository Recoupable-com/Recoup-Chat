"use client";

import { useState } from "react";
import SandboxCreateSection from "@/components/Sandboxes/SandboxCreateSection";
import SandboxList from "@/components/Sandboxes/SandboxList";
import type { Sandbox } from "@/lib/sandboxes/createSandbox";

export default function SandboxesPage() {
  const [sandboxes, setSandboxes] = useState<Sandbox[]>([]);

  const handleSandboxCreated = (newSandboxes: Sandbox[]) => {
    setSandboxes((prev) => [...newSandboxes, ...prev]);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-semibold">Sandboxes</h1>
      <SandboxCreateSection onSandboxCreated={handleSandboxCreated} />
      <SandboxList sandboxes={sandboxes} />
    </div>
  );
}
