import { useState } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import getLatestUserMessageText from "@/lib/messages/getLatestUserMessageText";
import { fetchConnectedAccountsRefresh } from "@/lib/composio/googleSheets/fetchConnectedAccountsRefresh";

export function useGoogleSheetsLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUserProvider();
  const { messages } = useVercelChatContext();
  const accountId = userData?.account_id;

  const handleLogin = async () => {
    if (!accountId) {
      console.error("Account ID is required for Google Sheets login");
      return;
    }

    // Build redirectUrl using latest user message, matching getGoogleSheetsTools.ts
    const latestUserMessageText = getLatestUserMessageText(messages);
    const redirectUrl = `https://chat.recoupable.com?q=${encodeURIComponent(
      latestUserMessageText
    )}`;

    setIsLoading(true);

    try {
      const data = await fetchConnectedAccountsRefresh({
        accountId,
        redirectUrl,
      });

      // Open the OAuth URL in a new tab
      if (data.redirect_url) {
        window.open(data.redirect_url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Error initiating Google Sheets login:", error);
      alert("Failed to initiate Google Sheets login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin,
  };
}
