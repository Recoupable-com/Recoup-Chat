import { useState } from "react";

const useTikTokReport = () => {
  const [tiktokTrends, setTiktokTrends] = useState<any>(null);
  const [isSearchingTrends, setIsSearchingTrends] = useState(false);
  const [isGettingVideos, setIsGettingVideos] = useState(false);
  const [isGettingAnalysis, setIsGettingAnalysis] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [tiktokVideos, setTiktokVideos] = useState<any>({});
  const [tiktokAnalysis, setTiktokAnalysis] = useState<any>(null);
  const [tiktokNextSteps, setTiktokNextSteps] = useState("");
  const [tiktokReportContent, setTiktokReportContent] = useState("");

  const initReport = () => {
    setTiktokAnalysis(null);
    setTiktokTrends(null);
    setTiktokVideos({});
  };

  return {
    initReport,
    isSearchingTrends,
    setTiktokTrends,
    setIsSearchingTrends,
    tiktokTrends,
    setIsGettingVideos,
    isGettingVideos,
    setTiktokVideos,
    tiktokVideos,
    setTiktokAnalysis,
    setTiktokNextSteps,
    tiktokNextSteps,
    tiktokReportContent,
    setIsGettingAnalysis,
    isGettingAnalysis,
    setTiktokReportContent,
    setIsGeneratingReport,
    isGeneratingReport,
    tiktokAnalysis,
  };
};

export default useTikTokReport;
