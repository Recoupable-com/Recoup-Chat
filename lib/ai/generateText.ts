import { generateText as generate } from "ai";
import { DEFAULT_MODEL } from "@/lib/consts";

const generateText = async ({
  system,
  prompt,
}: {
  system?: string;
  prompt: string;
}) => {
  const result = await generate({
    system,
    model: DEFAULT_MODEL,
    prompt,
  });

  return result;
};

export default generateText;
