import { getSerpApiKey, SERPAPI_BASE_URL } from "./config";
import type { 
  SerpApiResponse, 
  SearchImagesOptions 
} from "./types";

export async function searchGoogleImages(
  options: SearchImagesOptions
): Promise<SerpApiResponse> {
  const {
    query,
    limit = 10,
    page = 0,
    imageSize,
    imageType,
    aspectRatio
  } = options;

  const apiKey = getSerpApiKey();

  // Build tbs parameter for advanced filtering
  const tbsParams: string[] = [];
  if (imageType) tbsParams.push(`itp:${imageType}`);
  if (imageSize) tbsParams.push(`isz:${imageSize}`);
  const tbs = tbsParams.length > 0 ? tbsParams.join(",") : undefined;

  // Build query parameters
  const params = new URLSearchParams({
    engine: "google_images",
    q: query,
    api_key: apiKey,
    ijn: page.toString(),
  });

  if (tbs) params.append("tbs", tbs);
  if (aspectRatio) params.append("imgar", aspectRatio);

  const url = `${SERPAPI_BASE_URL}/search.json?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `SerpAPI request failed: ${response.status} - ${errorText}`
    );
  }

  const data: SerpApiResponse = await response.json();

  // Limit results if specified
  if (limit && data.images_results) {
    data.images_results = data.images_results.slice(0, limit);
  }

  return data;
}

