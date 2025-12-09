"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useApiKeyProvider } from "@/providers/ApiKeyProvider";
import { formatDate } from "@/lib/date/formatDate";

export function ApiKeyList() {
  const { apiKeys, loadingKeys, deleteApiKey } = useApiKeyProvider();

  if (loadingKeys) {
    return (
      <div className="space-y-4">
        <div className="py-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-foreground"></div>
          <p className="mt-2 text-muted-foreground">Loading API keys...</p>
        </div>
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          No API keys found. Create your first API key above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">
          {`We don't store your API keys. Please be sure to store them somewhere safe!`}
        </p>
      </div>

      <div className="space-y-3">
        {apiKeys.map((key) => (
          <div key={key.id} className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <Input
                value={`${key.name}: ***************`}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => deleteApiKey(key.id)}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Created {formatDate(key.created_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
