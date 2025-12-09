"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Loader2 } from "lucide-react";
import { useApiKeyProvider } from "@/providers/ApiKeyProvider";
import { toast } from "sonner";
import { ApiKeyModal } from "./ApiKeyModal";

export function ApiKeyForm() {
  const { createApiKey, apiKey, showApiKeyModal, setShowApiKeyModal } =
    useApiKeyProvider();
  const [keyName, setKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      toast.error("Please enter a name for your API key");
      return;
    }
    setIsCreating(true);
    await createApiKey(keyName.trim());
    setIsCreating(false);
    setKeyName("");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="keyName">API Key Name</Label>
          <Input
            id="keyName"
            type="text"
            placeholder="e.g., My Production Key"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="mt-1"
            disabled={isCreating}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Choose a descriptive name to identify this API key
          </p>
        </div>

        <Button
          type="submit"
          className="flex w-full items-center gap-2"
          disabled={isCreating || !keyName.trim()}
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating API Key...
            </>
          ) : (
            <>
              <Key className="h-4 w-4" />
              Create API Key
            </>
          )}
        </Button>
      </form>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        apiKey={apiKey || ""}
      />
    </div>
  );
}
