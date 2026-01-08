"use client";

import { HardDrive } from "lucide-react";
import { useGoogleDriveLogin } from "@/hooks/useGoogleDriveLogin";
import { ComposioLoginResult } from "../composio/ComposioLoginResult";

export function GoogleDriveLoginResult() {
  const { isLoading, handleLogin } = useGoogleDriveLogin();

  return (
    <ComposioLoginResult
      toolkitName="Google Drive"
      description="uploading, downloading, and managing files"
      icon={HardDrive}
      buttonColor="bg-blue-600 hover:bg-blue-700"
      isLoading={isLoading}
      onLogin={handleLogin}
    />
  );
}

export default GoogleDriveLoginResult;
