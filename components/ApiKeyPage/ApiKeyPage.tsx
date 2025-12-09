"use client";

import { Fragment } from "react";
import { usePrivy } from "@privy-io/react-auth";
import ApiKeyManager from "./ApiKeyManager";
import { useUserProvider } from "@/providers/UserProvder";

const ApiKeyPage = () => {
  const { userData } = useUserProvider();
  const { ready } = usePrivy();

  if (!ready) return <Fragment />;
  if (!userData?.account_id) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground">
          Please sign in to manage API keys.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:px-8 md:py-6">
      <ApiKeyManager />
    </main>
  );
};

export default ApiKeyPage;
