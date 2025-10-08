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

  const formData = new FormData();
  formData.append("model", request.model);
  formData.append("prompt", request.prompt);
  formData.append("seconds", request.seconds.toString());
  formData.append("size", request.size);

  const response = await fetch("https://api.openai.com/v1/videos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
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
