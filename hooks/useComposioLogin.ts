import { useState } from "react";
import { useUserProvider } from "@/providers/UserProvder";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import getLatestUserMessageText from "@/lib/messages/getLatestUserMessageText";
import { fetchConnectedAccountsRefresh } from "@/lib/composio/fetchConnectedAccountsRefresh";
import {
  ComposioToolkitKey,
  getToolkitConfig,
} from "@/lib/composio/toolkits";
import { toast } from "sonner";

/**
 * Hook for handling Composio toolkit login.
 *
 * @param toolkitKey - The toolkit to login to (e.g., "GOOGLE_SHEETS", "GOOGLE_DRIVE")
 */
export function useComposioLogin(toolkitKey: ComposioToolkitKey) {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUserProvider();
  const { messages } = useVercelChatContext();
  const accountId = userData?.account_id as string;
  const config = getToolkitConfig(toolkitKey);

  const handleLogin = async () => {
    const latestUserMessageText = getLatestUserMessageText(messages);
    // Use current origin so it works in both local dev and production
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://chat.recoupable.com";
    const redirectUrl = `${baseUrl}?q=${encodeURIComponent(
      latestUserMessageText
    )}`;

    setIsLoading(true);

    try {
      const data = await fetchConnectedAccountsRefresh(toolkitKey, {
        accountId,
        redirectUrl,
      });

      if (data.redirect_url) {
        // Use location.href instead of window.open to avoid popup blocker
        // since this is called after an async operation
        window.location.href = data.redirect_url;
      }
    } catch (error) {
      toast.error(
        `Failed to initiate ${config.name} login. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin,
    toolkitName: config.name,
  };
}
