"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NEW_API_BASE_URL } from "@/lib/consts";

interface Sandbox {
  sandboxId: string;
  sandboxStatus: "pending" | "running" | "stopping" | "stopped" | "failed";
  timeout: number;
  createdAt: string;
}

interface CreateSandboxResponse {
  status: "success" | "error";
  sandboxes?: Sandbox[];
  message?: string;
}

export default function SandboxesPage() {
  const { getAccessToken } = usePrivy();
  const [prompt, setPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [sandboxes, setSandboxes] = useState<Sandbox[]>([]);

  const handleCreateSandbox = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsCreating(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        toast.error("Please sign in to create a sandbox");
        return;
      }

      const response = await fetch(`${NEW_API_BASE_URL}/api/sandboxes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data: CreateSandboxResponse = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(data.message || "Failed to create sandbox");
      }

      if (data.sandboxes) {
        setSandboxes((prev) => [...data.sandboxes!, ...prev]);
        toast.success("Sandbox created successfully");
        setPrompt("");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create sandbox"
      );
    } finally {
      setIsCreating(false);
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
