import { z } from "zod";
import { tool } from "ai";
import getConnectedAccount from "@/lib/composio/googleSheets/getConnectedAccount";

const schema = z.object({
  account_id: z
    .string()
    .min(
      1,
      "account_id is required and should be pulled from the system prompt."
    ),
});

const googleSheetsLoginTool = tool({
  description:
    "Initiate the authentication flow for the Google Sheets account.",
  inputSchema: schema,
  execute: async ({ account_id }) => {
    await getConnectedAccount(account_id);
    return {
      success: true,
      message:
        "Google Sheets login initiated successfully. Please click the button above to login with Google Sheets.",
    };
  },
});

export default googleSheetsLoginTool;
