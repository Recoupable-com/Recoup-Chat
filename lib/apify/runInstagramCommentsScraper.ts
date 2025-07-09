import { APIFY_WEBHOOKS_VALUE } from "@/lib/consts";
import { ApifyScraperResult } from "@/lib/apify/types";

/**
 * Runs the Instagram comments scraper for the provided post URLs
 * @param postUrls - Array of Instagram post URLs to fetch comments for
 * @param resultsLimit - Optional limit on the number of comments to fetch per post
 * @returns Promise with runId, datasetId, and error information
 */
export default async function runInstagramCommentsScraper(
  postUrls: string[],
  resultsLimit?: number
): Promise<ApifyScraperResult> {
  try {
    if (!postUrls || postUrls.length === 0) {
      return {
        runId: "",
        datasetId: "",
        error: "At least one Instagram post URL is required",
      };
    }

    // Construct URL with postUrls as query parameters
    const url = new URL("https://api.recoupable.com/api/instagram/comments");
    postUrls.forEach((postUrl) => {
      url.searchParams.append("postUrls", postUrl);
    });

    // Add webhooks parameter with shared constant
    url.searchParams.append("webhooks", APIFY_WEBHOOKS_VALUE);

    // Add resultsLimit parameter if provided
    if (resultsLimit !== undefined) {
      url.searchParams.append("resultsLimit", resultsLimit.toString());
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in runInstagramCommentsScraper:", error);
    return {
      runId: "",
      datasetId: "",
      error:
        error instanceof Error
          ? error.message
          : "Failed to scrape Instagram comments",
    };
  }
}