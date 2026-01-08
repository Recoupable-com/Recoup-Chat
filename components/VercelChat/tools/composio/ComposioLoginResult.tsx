"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserProvider } from "@/providers/UserProvder";
import AccountIdDisplay from "@/components/ArtistSetting/AccountIdDisplay";

interface ComposioLoginResultProps {
  toolkitName: string;
  description: string;
  icon: LucideIcon;
  buttonColor: string;
  isLoading: boolean;
  onLogin: () => void;
}

export function ComposioLoginResult({
  toolkitName,
  description,
  icon: Icon,
  buttonColor,
  isLoading,
  onLogin,
}: ComposioLoginResultProps) {
  const { userData } = useUserProvider();
  const accountId = userData?.account_id;

  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg bg-muted border border-border my-2 max-w-md">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium text-foreground">
          {toolkitName} Access Required
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Connect your {toolkitName} account to enable {description}.
      </p>

      {accountId && <AccountIdDisplay accountId={accountId} label="Account" />}

      <Button
        onClick={onLogin}
        className={`w-full ${buttonColor} text-white`}
        size="sm"
        disabled={isLoading || !accountId}
      >
        {isLoading ? (
          <span>Connecting...</span>
        ) : (
          <>
            <Icon className="h-4 w-4 mr-2" />
            Connect {toolkitName}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        You&apos;ll be redirected to Google to authorize access to your{" "}
        {toolkitName} for this account.
      </p>
    </div>
  );
}

export default ComposioLoginResult;
