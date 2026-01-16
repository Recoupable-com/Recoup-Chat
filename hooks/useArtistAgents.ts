import { ArtistAgent } from "@/lib/supabase/getArtistAgents";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { SOCIAL } from "@/types/Agent";
import { useEffect, useState } from "react";
import { useAccessToken } from "@/hooks/useAccessToken";
import { NEW_API_BASE_URL } from "@/lib/consts";

interface ArtistAgentsApiResponse {
  status: "success" | "error";
  agents?: ArtistAgent[];
  message?: string;
}

const useArtistAgents = () => {
  const [agents, setAgents] = useState<ArtistAgent[]>([]);
  const { selectedArtist } = useArtistProvider();
  const accessToken = useAccessToken();

  useEffect(() => {
    const getAgents = async () => {
      if (!selectedArtist) return;
      if (!accessToken) return;

      const socialIds = selectedArtist.account_socials?.map(
        (social: SOCIAL) => social.id
      );

      if (!socialIds?.length) return;

      const queryString = socialIds.map((id) => `socialId=${id}`).join("&");

      const response = await fetch(
        `${NEW_API_BASE_URL}/api/artist-agents?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data: ArtistAgentsApiResponse = await response.json();

      if (data.status === "error") {
        console.error("Failed to fetch artist agents:", data.message);
        return;
      }

      if (data.agents) {
        setAgents(data.agents);
      }
    };
    getAgents();
  }, [selectedArtist, accessToken]);

  return {
    agents,
  };
};

export default useArtistAgents;
