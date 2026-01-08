import { z } from "zod";
import { tool, Tool } from "ai";
import { getConnectedAccount } from "@/lib/composio/getConnectedAccount";
import { ComposioToolkitKey, getToolkitConfig } from "@/lib/composio/toolkits";

const loginSchema = z.object({
  account_id: z
    .string()
    .min(
      1,
      "account_id is required and should be pulled from the system prompt."
    ),
});

/**
 * Create a login tool for a specific Composio toolkit.
 */
function createLoginTool(toolkitKey: ComposioToolkitKey): Tool {
  const config = getToolkitConfig(toolkitKey);

  return tool({
    description: `Initiate the authentication flow for ${config.name}. Use this when the user wants to access ${config.description}.`,
    inputSchema: loginSchema,
    execute: async ({ account_id }) => {
      await getConnectedAccount(toolkitKey, account_id);
      return {
        success: true,
        message: `${config.name} login initiated successfully. Please click the button above to login with ${config.name}.`,
      };
    },
  });
}

// Pre-create login tools for each toolkit
const loginTools: Record<ComposioToolkitKey, Tool> = {
  GOOGLE_SHEETS: createLoginTool("GOOGLE_SHEETS"),
  GOOGLE_DRIVE: createLoginTool("GOOGLE_DRIVE"),
};

/**
 * Get the login tool for a specific toolkit.
 */
export function getLoginToolForToolkit(toolkitKey: ComposioToolkitKey): Tool {
  return loginTools[toolkitKey];
}

// Export individual tools for backward compatibility
export const googleSheetsLoginTool = loginTools.GOOGLE_SHEETS;
export const googleDriveLoginTool = loginTools.GOOGLE_DRIVE;
