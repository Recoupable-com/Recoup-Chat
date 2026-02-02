"use client";

import { useState } from "react";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useCreateSandbox from "@/hooks/useCreateSandbox";
import type { Sandbox } from "@/lib/sandboxes/createSandbox";

interface SandboxCreateSectionProps {
  onSandboxCreated: (sandboxes: Sandbox[]) => void;
}

export default function SandboxCreateSection({
  onSandboxCreated,
}: SandboxCreateSectionProps) {
  const [prompt, setPrompt] = useState("");
  const { createSandbox, isCreating } = useCreateSandbox();

  const handleCreateSandbox = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      const newSandboxes = await createSandbox(prompt);
      onSandboxCreated(newSandboxes);
      toast.success("Sandbox created successfully");
      setPrompt("");
    } catch {
      // Error is handled by the hook
    }
  };

  return (
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
  );
}
