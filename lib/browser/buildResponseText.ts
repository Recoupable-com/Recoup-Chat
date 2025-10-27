import { CONTENT_LIMITS } from "./constants";

/**
 * Build formatted response text with rate limit warnings, content, and actions
 */
export function buildResponseText(
  visibleContent: string,
  actionsText: string,
  modalDismissed: boolean,
  platformName: string,
  isRateLimited: boolean
): string {
  let responseText = "";
  
  // Add rate limit warning if detected
  if (isRateLimited) {
    responseText += "⚠️ RATE LIMIT DETECTED\n";
    responseText += `${platformName || 'The website'} is limiting automated requests. Try:\n`;
    responseText += "1. Wait a few minutes before trying again\n";
    responseText += "2. Reduce request frequency\n";
    responseText += "3. Add delays between requests\n\n";
  }
  
  if (modalDismissed) {
    responseText += "✅ Login modal detected and dismissed\n\n";
  }
  
  responseText += "📄 VISIBLE PAGE CONTENT:\n";
  responseText += "════════════════════════════════════════\n";
  responseText += visibleContent.trim().slice(0, CONTENT_LIMITS.MAX_VISIBLE_CONTENT_LENGTH);
  if (visibleContent.length > CONTENT_LIMITS.MAX_VISIBLE_CONTENT_LENGTH) {
    responseText += "\n... (content truncated)";
  }
  responseText += "\n\n🎯 AVAILABLE ACTIONS:\n";
  responseText += "════════════════════════════════════════\n";
  responseText += actionsText;

  return responseText;
}

