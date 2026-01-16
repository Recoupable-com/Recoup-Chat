import type { AgentTemplateRow } from "@/types/AgentTemplates";
import type { AccountWithDetails } from "@/lib/supabase/accounts/getAccountWithDetails";
import { NEW_API_BASE_URL } from "@/lib/consts";

interface AgentTemplatesApiResponse {
  status: "success" | "error";
  templates?: AgentTemplateRow[];
  message?: string;
}

const fetchAgentTemplates = async (
  userData: AccountWithDetails,
  accessToken: string | null
): Promise<AgentTemplateRow[]> => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const res = await fetch(
    `${NEW_API_BASE_URL}/api/agent-templates?userId=${userData?.id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch agent templates");
  }

  const data: AgentTemplatesApiResponse = await res.json();

  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch agent templates");
  }

  return data.templates || [];
};

export default fetchAgentTemplates;
