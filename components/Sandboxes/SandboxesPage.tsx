"use client";

import { useState } from "react";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useCreateSandbox from "@/hooks/useCreateSandbox";
import type { Sandbox } from "@/lib/sandbox/createSandbox";

export default function SandboxesPage() {
  const [prompt, setPrompt] = useState("");
  const [sandboxes, setSandboxes] = useState<Sandbox[]>([]);
  const { createSandbox, isCreating } = useCreateSandbox();

  const handleCreateSandbox = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      const newSandboxes = await createSandbox(prompt);
      setSandboxes((prev) => [...newSandboxes, ...prev]);
      toast.success("Sandbox created successfully");
      setPrompt("");
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-semibold">Sandboxes</h1>

      <div className="w-full max-w-md space-y-4">
        <Textarea
          placeholder="Enter a prompt for Claude Code in the sandbox..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isCreating}
        />

        <Button
          onClick={handleCreateSandbox}
          disabled={isCreating || !prompt.trim()}
          className="w-full"
        >
          {isCreating ? (
            <>
              <Loader className="animate-spin" />
              Creating Sandbox...
            </>
          ) : (
            <>
              <Plus />
              Create Sandbox
            </>
          )}
        </Button>
      </div>

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
