import { useEffect } from "react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import Segments from "./Segments";
import SocialSharing from "../SocialSharing";
import getAggregatedSocialProfiles from "@/lib/agent/getAggregatedSocialProfiles";
import SegmentsSkeleton from "./SegmentsSkeleton";
import { Skeleton } from "../ui/skeleton";
import { useArtistSegments } from "@/hooks/useArtistSegments";

const CompletedAnalysis = () => {
  const { funnelName, isLoadingAgent } = useFunnelAnalysisProvider();
  const { selectedArtist } = useArtistProvider();

  const {
    data: segments,
    isLoading: isLoadingSegments,
    isFetching,
  } = useArtistSegments(selectedArtist?.account_id);

  const isLoading = isLoadingSegments || isLoadingAgent || isFetching;

  // Track component mounting and state
  useEffect(() => {
    console.log("[CompletedAnalysis] Mount:", {
      hasSegments: segments?.length > 0,
      segmentsLength: segments?.length,
      isLoading,
      isLoadingSegments,
      isLoadingAgent,
      isFetching,
      artistId: selectedArtist?.account_id,
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Track segments state changes
  useEffect(() => {
    console.log("[CompletedAnalysis] Segments Updated:", {
      hasSegments: segments?.length > 0,
      segmentsLength: segments?.length,
      isLoading,
      timestamp: new Date().toISOString(),
    });
  }, [segments, isLoading]);

  const FanSegmentLabel = () => (
    <p className="text-lg md:text-xl text-xl font-bold py-4"> Fan Segments</p>
  );

  return (
    <>
      <p className="text-lg md:text-xl font-bold pb-4">
        <span className="capitalize">{funnelName}</span> Analysis complete✅
      </p>
      {isLoading ? (
        <>
          <Skeleton className="w-full h-10" />
          <FanSegmentLabel />
          <Skeleton className="w-full h-10" />
          <SegmentsSkeleton />
        </>
      ) : (
        <>
          <p>{`${selectedArtist?.name} has ${getAggregatedSocialProfiles(selectedArtist)?.followerCount} followers. We've analyzed your most recent 100 engagements in this quick scan. Select a fan segmentation below to generate a detailed report for brand partnership opportunities.`}</p>
          <FanSegmentLabel />
          <p>{`We categorized ${selectedArtist?.name}'s fans into ${segments?.length || 0} different segments - click any to explore. The agent is running in the background and will notify you of new insights!`}</p>
          <Segments segments={segments || []} />
        </>
      )}
      <SocialSharing />
    </>
  );
};

export default CompletedAnalysis;
