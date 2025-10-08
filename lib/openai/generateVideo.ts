export interface GenerateVideoRequest {
  model: string;
  prompt: string;
  seconds: number;
  size: string;
}

export interface GenerateVideoResponse {
  id: string;
  object: string;
  model: string;
  status: string;
  progress?: number;
  created_at?: number;
  size: string;
  seconds: string;
  quality?: string;
}

/**
 * Generates a video using OpenAI's API
 */
export async function generateVideo(
  request: GenerateVideoRequest
): Promise<GenerateVideoResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const response = await fetch("https://api.openai.com/v1/videos/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `API request failed with status ${response.status}`
    );
  }

  const data: GenerateVideoResponse = await response.json();
  return data;
}
