import { useComposioLogin } from "./useComposioLogin";

/**
 * Hook for Google Drive login.
 */
export function useGoogleDriveLogin() {
  return useComposioLogin("GOOGLE_DRIVE");
}
