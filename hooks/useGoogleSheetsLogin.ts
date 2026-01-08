import { useComposioLogin } from "./useComposioLogin";

/**
 * Hook for Google Sheets login.
 */
export function useGoogleSheetsLogin() {
  return useComposioLogin("GOOGLE_SHEETS");
}
