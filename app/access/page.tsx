"use client";

import { useEffect, useState, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function AccessPage() {
  const { getAccessToken, ready, authenticated } = usePrivy();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchToken = useCallback(async () => {
    if (!ready || !authenticated) return;

    setLoading(true);
    try {
      const token = await getAccessToken();
      setAccessToken(token);
    } catch (err) {
      toast.error("Failed to get access token");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, ready, authenticated]);

  useEffect(() => {
    if (ready && authenticated) {
      fetchToken();
    }
  }, [ready, authenticated, fetchToken]);

  const handleCopy = async () => {
    if (!accessToken) return;

    try {
      await navigator.clipboard.writeText(accessToken);
      setCopied(true);
      toast.success("Access token copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy access token");
    }
  };

  if (!ready) {
    return (
      <main className="min-h-screen p-4 md:px-8 md:py-6">
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen p-4 md:px-8 md:py-6">
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">
            Please sign in to view your access token.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:px-8 md:py-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Access Token</CardTitle>
          <CardDescription>
            Your Privy Bearer token for API authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="py-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-foreground"></div>
              <p className="mt-2 text-muted-foreground">
                Loading access token...
              </p>
            </div>
          ) : accessToken ? (
            <>
              <div className="rounded-lg border bg-muted p-4">
                <pre className="text-sm font-mono break-all whitespace-pre-wrap">
                  {accessToken}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Token
                    </>
                  )}
                </Button>
                <Button onClick={fetchToken} variant="outline">
                  Refresh Token
                </Button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                No access token available
              </p>
              <Button onClick={fetchToken}>Get Access Token</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
