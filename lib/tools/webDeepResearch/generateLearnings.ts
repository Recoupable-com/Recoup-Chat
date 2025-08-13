import { generateObject } from "ai";
import { z } from "zod";
import { DEFAULT_MODEL } from "@/lib/consts";
import { PerplexitySearchResults } from "./searchWeb";

const generateLearnings = async (
  query: string,
  searchResult: PerplexitySearchResults
) => {
  const { object } = await generateObject({
    model: DEFAULT_MODEL,
    prompt: `The user is researching "${query}". The following search result were deemed relevant.
      Generate a learning and a follow-up question from the following search result:
  
      <search_result>
      ${searchResult.choices[0].message.content}
      </search_result>
        `,
    schema: z.object({
      learning: z.string(),
      followUpQuestions: z.array(z.string()),
    }),
  });
  return object;
};

export default generateLearnings;
