import { generateText as generate } from "@/lib/braintrust/client";
import { DEFAULT_MODEL } from "@/lib/consts";

const generateText = async ({
  system,
  prompt,
  model,
}: {
  system?: string;
  prompt: string;
  model?: string;
}) => {
  const result = await generate({
    system,
    model: model || DEFAULT_MODEL,
    prompt,
  });

  return result;
};

export default generateText;
