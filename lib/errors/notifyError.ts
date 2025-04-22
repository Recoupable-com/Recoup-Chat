import {
  ErrorContext,
  sendErrorNotification,
} from "../telegram/sendErrorNotification";

/**
 * Standardized error notification helper
 * @param error The error that occurred
 * @param context Error context including user info and request details
 */
export async function notifyError(error: unknown, context: ErrorContext) {
  return sendErrorNotification({
    error,
    ...context,
  }).catch((err) => {
    console.error("Failed to send error notification:", err);
  });
}
