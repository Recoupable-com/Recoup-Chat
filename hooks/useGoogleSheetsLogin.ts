import { useState } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import getLatestUserMessageText from "@/lib/messages/getLatestUserMessageText";
import { fetchConnectedAccountsRefresh } from "@/lib/composio/googleSheets/fetchConnectedAccountsRefresh";
import { toast } from "sonner";

export function useGoogleSheetsLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUserProvider();
  const { messages } = useVercelChatContext();
  const accountId = userData?.account_id;

  const handleLogin = async () => {
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

      if (data.redirect_url) {
        window.open(data.redirect_url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Error initiating Google Sheets login:", error);
      toast.error("Failed to initiate Google Sheets login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin,
  };
}
