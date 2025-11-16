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
    .describe(
      "The first message in this conversation from the customer. It will be used to retry the prompt after successful authentication."
    ),
});

const googleSheetsLoginTool = tool({
  description:
    "Initiate the authentication flow for the Google Sheets account.",
  inputSchema: schema,
  execute: async ({ account_id, initialPrompt }) => {
    const options: CreateConnectedAccountOptions = {
      callbackUrl: `https://chat.recoupable.com?q=${encodeURIComponent(initialPrompt)}`,
    };
    console.log("SWEETS options", options);

    return await getConnectedAccount(account_id, options);
  },
});

export default googleSheetsLoginTool;
