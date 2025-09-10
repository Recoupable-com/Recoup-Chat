/**
 * Centralizes Fal AI configuration setup
 * Provides consistent configuration across all Fal tools
 */

/**
 * Gets the Fal API credentials from environment variables
 * Uses FAL_API_KEY as the standard environment variable name
 */
export function getFalCredentials(): string | undefined {
  return process.env.FAL_API_KEY;
}

/**
 * Configures the Fal client with credentials
 * @param fal - The Fal client instance to configure
 */
export function configureFalClient(fal: { config: (options: { credentials?: string }) => void }): void {
  fal.config({
    credentials: getFalCredentials(),
  });
}
