import { z } from "zod";
import { Tool } from "ai";
import { getCatalogs } from "@/lib/catalog/getCatalogs";

const getCatalogsTool: Tool = {
  description: `CRITICAL: Retrieve catalogs associated with the current account for ANY music recommendation request.
    
    MANDATORY: Call this tool FIRST when user requests:
    - "[Brand/Platform] needs songs for [theme/playlist]" 
    - Any playlist recommendations
    - Music suggestions for specific themes, holidays, or events
    - Sync licensing opportunities
    - Curated collections for platforms
    
    Returns catalog metadata including id, name, created_at, and updated_at.
    You MUST call this before calling select_catalog_songs to get the catalog_id parameter.`,
  inputSchema: z.object({
    account_id: z
      .string()
      .describe("Use account_id from the system prompt. Never ask for this."),
  }),
  execute: async ({ account_id }) => {
    try {
      const data = await getCatalogs(account_id);

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
