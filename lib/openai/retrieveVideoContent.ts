export interface VideoContentResponse {
  blob: Blob;
  dataUrl: string;
  contentType: string;
  size: number;
}

/**
 * Streams and retrieves the rendered video content from OpenAI's API
 */
export async function retrieveVideoContent(
  videoId: string
): Promise<VideoContentResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const response = await fetch(
    `https://api.openai.com/v1/videos/${videoId}/content`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `API request failed with status ${response.status}`
    );
  }

  const blob = await response.blob();
  const contentType = response.headers.get("content-type") || "video/mp4";
  const dataUrl = URL.createObjectURL(blob);

  return {
    blob,
    dataUrl,
    contentType,
    size: blob.size,
  };
}
