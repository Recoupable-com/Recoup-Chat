"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { Button } from "@/components/ui/button";
import { useUserProvider } from "@/providers/UserProvder";

export default function AuthTestPage() {
  const { authenticated, login, user } = usePrivy();
  const { authenticatedFetch } = useAuthenticatedFetch();
  const { userData } = useUserProvider();
  const [logs, setLogs] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const append = (line: string) => setLogs((prev) => prev + (prev ? "\n" : "") + line);

  const handleCall = async () => {
    try {
      setLoading(true);
      setLogs("");
      if (!authenticated) {
        append("Not authenticated. Triggering login...");
        await login();
      }

      const res = await authenticatedFetch("/api/auth-test");
      append(`Status: ${res.status}`);
      const data = await res.json();
      append(`Client user.id (Privy): ${user?.id ?? "n/a"}`);
      append(`Server claims.userId: ${data?.claims?.userId ?? "n/a"}`);
      append(JSON.stringify(data, null, 2));
    } catch (e) {
      append(`Error: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Privy Auth Test</h1>
        <p className="text-sm text-muted-foreground">Calls /api/auth-test with a Bearer token.</p>
        <p className="text-xs text-muted-foreground">Client user.id: {user?.id ?? "n/a"}</p>
        <p className="text-xs text-muted-foreground">Userdata.id: {userData?.id ?? "n/a"}</p>
      </div>
      <Button onClick={handleCall} disabled={loading}>
        {loading ? "Testing..." : "Test Authenticated Request"}
      </Button>
      <pre className="bg-muted p-3 rounded text-sm overflow-auto whitespace-pre-wrap min-h-24">
        {logs || "Logs will appear here..."}
      </pre>
    </div>
  );
}


