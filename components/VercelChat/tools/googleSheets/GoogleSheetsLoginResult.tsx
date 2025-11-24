"use client";

import React from "react";
import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserProvider } from "@/providers/UserProvder";
import AccountIdDisplay from "@/components/ArtistSetting/AccountIdDisplay";
import { useGoogleSheetsLogin } from "@/hooks/useGoogleSheetsLogin";

export function GoogleSheetsLoginResult() {
  const { userData } = useUserProvider();
  const accountId = userData?.account_id;
  const { isLoading, handleLogin } = useGoogleSheetsLogin();

  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg bg-muted border border-border my-2 max-w-md">
      <div className="flex items-center space-x-2">
        <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium text-foreground">
          Google Sheets Access Required
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Connect your Google Sheets account to enable reading and writing to
        spreadsheets.
      </p>

      {accountId && <AccountIdDisplay accountId={accountId} label="Account" />}

      <Button
        onClick={handleLogin}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        size="sm"
        disabled={isLoading || !accountId}
      >
        {isLoading ? (
          <>
            <span className="mr-2">Connecting...</span>
          </>
        ) : (
          <>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Connect Google Sheets
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        You&apos;ll be redirected to Google to authorize access to your Google
        Sheets for this account.
      </p>
    </div>
  );
}

export default GoogleSheetsLoginResult;
