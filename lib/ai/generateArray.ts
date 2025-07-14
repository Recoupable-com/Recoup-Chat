import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { GOOGLE_GEMINI_MODEL } from "../consts";

export interface GenerateArrayResult {
  segmentName: string;
  fans: string[];
}

const generateArray = async ({
  system,
  prompt,
}: {
  system?: string;
  prompt: string;
}): Promise<GenerateArrayResult[]> => {
  const result = await generateObject({
    model: google(GOOGLE_GEMINI_MODEL),
    system,
    prompt,
    output: "array",
    schema: z.object({
      segmentName: z.string().describe("Segment name."),
      fans: z.array(z.string()).describe(
        `Array of fan_social_id included in the segment. 
          Do not make these up.
          Only use the actual fan_social_id provided in the fan data prompt input.`
      ),
    }),
  });

  return result.object;
};

export default generateArray;
