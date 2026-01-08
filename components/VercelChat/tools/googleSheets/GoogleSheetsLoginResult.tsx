"use client";

import { FileSpreadsheet } from "lucide-react";
import { useGoogleSheetsLogin } from "@/hooks/useGoogleSheetsLogin";
import { ComposioLoginResult } from "../composio/ComposioLoginResult";

export function GoogleSheetsLoginResult() {
  const { isLoading, handleLogin } = useGoogleSheetsLogin();

  return (
    <ComposioLoginResult
      toolkitName="Google Sheets"
      description="reading and writing to spreadsheets"
      icon={FileSpreadsheet}
      buttonColor="bg-green-600 hover:bg-green-700"
      isLoading={isLoading}
      onLogin={handleLogin}
    />
  );
}

export default GoogleSheetsLoginResult;
