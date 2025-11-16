import { z } from "zod";
import { tool } from "ai";
import { CreateConnectedAccountOptions } from "@composio/core";
import getConnectedAccount from "@/lib/composio/googleSheets/getConnectedAccount";

const schema = z.object({
  account_id: z
    .string()
    .min(
      1,
      "account_id is required and should be pulled from the system prompt."
    ),
  initialPrompt: z
    .string()
    .optional()
    .describe(
      "Initial chat prompt to be passed in the callback URL to retry the prompt after successful authentication."
    ),
});

const googleSheetsLoginTool = tool({
  description:
    "Initiate the authentication flow for the Google Sheets account.",
  inputSchema: schema,
  execute: async ({ account_id, initialPrompt }) => {
    const options: CreateConnectedAccountOptions | undefined = initialPrompt
      ? {
          callbackUrl: `https://chat.recoupable.com?q=${encodeURIComponent(initialPrompt)}`,
        }
      : undefined;

    return await getConnectedAccount(account_id, options);
  },
});

export default googleSheetsLoginTool;
