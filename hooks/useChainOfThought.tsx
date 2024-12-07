import getTikTokProfile from "@/lib/getTiktokProfile";
import getVideoComments from "@/lib/getVideoComments";
import uploadPfp from "@/lib/uploadPfp";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { SETTING_MODE } from "@/types/Setting";
import { STEP_OF_ANALYSIS } from "@/types/Thought";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import useSaveTiktokArtist from "./useSaveTiktokArtist";
import saveTiktokAnalysis from "@/lib/saveTiktokAnalysis";
import getSemgnets from "@/lib/getSegments";

const useChainOfThought = () => {
  const { setSettingMode } = useArtistProvider();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thought, setThought] = useState(STEP_OF_ANALYSIS.INITITAL);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [segments, setSegments] = useState<Array<any>>([]);
  const { saveTiktokArtist } = useSaveTiktokArtist();
  const { trackNewTitle } = useConversationsProvider();
  const { chat_id: chatId } = useParams();
  const { push } = useRouter();
  const { isPrepared } = useUserProvider();

  const handleAnalyze = async () => {
    if (!isPrepared()) return;
    if (!username || isLoading) return;
    let newId = "";
    if (!chatId) {
      newId = uuidV4();
      push(`/funnels/tiktok-account-analysis/${newId}`);
    }
    trackNewTitle(
      {
        title: `TikTok Analysis: ${username}`,
      },
      newId,
    );
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1900));
      const profile = await getTikTokProfile(
        username.replaceAll("@", ""),
        setThought,
      );
      const videoComments = await getVideoComments(
        encodeURIComponent(JSON.stringify(profile?.videos)),
        setThought,
        setProgress,
      );
      const avatar = await uploadPfp(profile.avatar);
      const profileWithComments = {
        ...profile,
        avatar,
        videos: videoComments.videos,
        total_video_comments_count: videoComments.total_video_comments_count,
      };
      setResult(profileWithComments);
      let fanSegmentsWithIcons = [];
      if (videoComments.videos.length > 0) {
        setThought(STEP_OF_ANALYSIS.SEGMENTS);
        fanSegmentsWithIcons = await getSemgnets(profileWithComments);
        setSegments([...fanSegmentsWithIcons]);
      }
      setSettingMode(SETTING_MODE.CREATE);
      setThought(STEP_OF_ANALYSIS.CREATING_ARTIST);
      const artistId = await saveTiktokArtist(profileWithComments);
      setThought(STEP_OF_ANALYSIS.SAVING_ANALYSIS);
      const result = await saveTiktokAnalysis(
        profileWithComments,
        fanSegmentsWithIcons,
        artistId,
        newId,
      );
      setResult(result);
      setThought(STEP_OF_ANALYSIS.FINISHED);
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  return {
    handleAnalyze,
    username,
    setUsername,
    isLoading,
    setIsLoading,
    thought,
    result,
    setResult,
    progress,
    setProgress,
    segments,
    setThought,
    setSegments,
  };
};

export default useChainOfThought;
