import type { Page } from "@browserbasehq/stagehand";
import { detectPlatform } from "./detectPlatform";
import { uploadScreenshot } from "./uploadScreenshot";

/**
 * Captures a screenshot from a browser page and uploads it to storage
 * @param page - Stagehand page instance
 * @param url - URL of the page (used for platform detection)
 * @returns Screenshot URL or empty string if upload fails
 */
export async function captureScreenshot(
  page: Page,
  url: string
): Promise<string> {
  const screenshotBase64 = await page.screenshot({ encoding: "base64" });
  const platformName = detectPlatform(url);
  const screenshotUrl = await uploadScreenshot(
    screenshotBase64 as string,
    platformName
  );

  return screenshotUrl;
}

