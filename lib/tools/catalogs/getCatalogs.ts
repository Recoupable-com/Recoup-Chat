import { z } from "zod";
import { Tool } from "ai";

const getCatalogsTool: Tool = {
  description: `Retrieve catalogs associated with the current account. 
    Returns catalog metadata including id, name, created_at, and updated_at.
    Call this tool first for any catalog-related operations.`,
  inputSchema: z.object({
    account_id: z
      .string()
      .describe("Use account_id from the system prompt. Never ask for this."),
  }),
  execute: async ({ account_id }) => {
    try {
      const response = await fetch(
        `https://api.recoupable.com/api/catalogs?account_id=${account_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.error || "Unknown error occurred");
      }

      return {
        success: true,
        catalogs: data.catalogs,
        total_count: data.catalogs?.length || 0,
        account_id,
      };
    } catch (error) {
      console.error("Error fetching catalogs:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch catalogs",
        catalogs: [],
        total_count: 0,
        account_id,
      };
    }
  },
};

export default getCatalogsTool;
