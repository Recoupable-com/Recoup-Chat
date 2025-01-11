"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function StartButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://143.198.164.177:3000/api/agentkit/run",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.walletAddress) {
        setWalletAddress(data.walletAddress);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={handleClick}
        size="lg"
        className="px-12 py-6 text-lg font-semibold hover:scale-105 transition-transform"
        disabled={isLoading}
      >
        {isLoading ? "Running..." : "Start"}
      </Button>
      {walletAddress && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600 mb-1">
            Your Agent&apos;s Wallet Address:
          </p>
          <p className="font-mono text-sm break-all">{walletAddress}</p>
        </div>
      )}
    </div>
  );
}
