import { ImageSkeleton } from "@/components/VercelChat/tools/image/ImageSkeleton";
import { ImageResult } from "@/components/VercelChat/tools/image/ImageResult";
import { NanoBananaResult } from "@/components/VercelChat/tools/image/NanoBananaResult";
import { ImageGenerationResult } from "@/lib/tools/generateImage";
import { NanoBananaGenerateResult } from "@/lib/tools/nanoBanana/nanoBananaGenerate";
import { NanoBananaEditResult } from "@/lib/tools/nanoBanana/nanoBananaEdit";
import MermaidDiagram from "@/components/VercelChat/tools/mermaid/MermaidDiagram";
import { MermaidDiagramSkeleton } from "@/components/VercelChat/tools/mermaid/MermaidDiagramSkeleton";
import { GenerateMermaidDiagramResult } from "@/lib/tools/generateMermaidDiagram";
import CreateArtistToolCall from "./tools/CreateArtistToolCall";
import ChatMarkdown from "@/components/Chat/ChatMarkdown";
import CreateArtistToolResult from "./tools/CreateArtistToolResult";
import { CreateArtistResult } from "@/lib/tools/createArtist";
import DeleteArtistToolCall from "./tools/DeleteArtistToolCall";
import DeleteArtistToolResult from "./tools/DeleteArtistToolResult";
import { DeleteArtistResult } from "@/lib/tools/deleteArtist";
import GetSpotifySearchToolResult from "./tools/GetSpotifySearchToolResult";
import {
  SpotifyDeepResearchResultUIType,
  SpotifyArtistTopTracksResultType,
  SpotifySearchResponse,
} from "@/types/spotify";
import { ArtistSocialsResultType } from "@/types/ArtistSocials";
import { ToolUIPart, getToolName } from "ai";
import UpdateArtistInfoSuccess from "./tools/UpdateArtistInfoSuccess";
import { UpdateAccountInfoResult } from "@/lib/tools/updateAccountInfo";
import UpdateArtistSocialsSuccess from "./tools/UpdateArtistSocialsSuccess";
import { UpdateArtistSocialsResult } from "@/lib/tools/updateArtistSocials";
import { TxtFileResult } from "@/components/ui/TxtFileResult";
import { TxtFileGenerationResult } from "@/lib/tools/createTxtFile";
import { Loader } from "lucide-react";
import { getDisplayToolName } from "@/lib/tools/get-tools-name";
import GenericSuccess from "./tools/GenericSuccess";
import getToolInfo from "@/lib/utils/getToolsInfo";
import { GetSpotifyPlayButtonClickedResult } from "@/lib/supabase/getSpotifyPlayButtonClicked";
import GetVideoGameCampaignPlaysResultComponent from "./tools/GetVideoGameCampaignPlaysResult";
import { CommentsResult } from "@/components/Chat/comments/CommentsResult";
import { CommentsResultData } from "@/types/Comment";
import CommentsResultSkeleton from "@/components/Chat/comments/CommentsResultSkeleton";
import GetSegmentFansResult from "./tools/segment-fans/GetSegmentFansResult";
import GetSegmentFansResultSkeleton from "./tools/segment-fans/GetSegmentFansResultSkeleton";
import { SegmentFansResult } from "@/types/fans";
import YouTubeAccessSkeleton from "./tools/youtube/YouTubeAccessSkeleton";
import YouTubeRevenueResult from "./tools/youtube/YouTubeRevenueResult";
import YouTubeRevenueSkeleton from "./tools/youtube/YouTubeRevenueSkeleton";
import {
  YouTubeChannelInfoResult,
  YouTubeChannelVideoListResult,
  YouTubeRevenueResult as YouTubeRevenueResultType,
} from "@/types/youtube";
import YouTubeChannelsResult from "./tools/youtube/YouTubeChannelsResult";
import YouTubeLoginResult from "./tools/youtube/YouTubeLoginResult";
import { YouTubeLoginResultType } from "@/lib/tools/youtube/youtubeLogin";
import YoutubeChannelVideosListResult from "./tools/youtube/YoutubeChannelVideosListResult";
import YouTubeChannelVideosListSkeleton from "./tools/youtube/YouTubeChannelVideosListSkeleton";
import YouTubeSetThumbnailResult from "./tools/youtube/YouTubeSetThumbnailResult";
import YouTubeSetThumbnailSkeleton from "./tools/youtube/YouTubeSetThumbnailSkeleton";
import type { YouTubeSetThumbnailResult as YouTubeSetThumbnailResultType } from "@/types/youtube";
import SearchWebSkeleton from "./tools/SearchWebSkeleton";
import SpotifyDeepResearchSkeleton from "./tools/SpotifyDeepResearchSkeleton";
import SearchWebResult, { SearchWebResultType } from "./tools/SearchWebResult";
import SpotifyDeepResearchResult from "./tools/SpotifyDeepResearchResult";
import { SearchProgress } from "@/lib/tools/searchWeb/types";
import GetArtistSocialsResult from "./tools/GetArtistSocialsResult";
import GetArtistSocialsSkeleton from "./tools/GetArtistSocialsSkeleton";
import GetSpotifyArtistAlbumsResult from "./tools/GetSpotifyArtistAlbumsResult";
import { SpotifyArtistAlbumsResultUIType } from "@/types/spotify";
import GetSpotifyArtistAlbumsSkeleton from "./tools/GetSpotifyArtistAlbumsSkeleton";
import SpotifyArtistTopTracksResult from "./tools/SpotifyArtistTopTracksResult";
import SpotifyArtistTopTracksSkeleton from "./tools/SpotifyArtistTopTracksSkeleton";
import GetScheduledActionsSuccess from "./tools/GetScheduledActionsSuccess";
import GetScheduledActionsSkeleton from "./tools/GetScheduledActionsSkeleton";
import { GetScheduledActionsResult } from "@/lib/tools/scheduled_actions/getScheduledActions";
import CreateScheduledActionsSuccess from "./tools/CreateScheduledActionsSuccess";
import CreateScheduledActionsSkeleton from "./tools/CreateScheduledActionsSkeleton";
import { CreateScheduledActionsResult } from "@/lib/tools/scheduled_actions/createScheduledActions";
import GetSpotifyAlbumWithTracksResult from "./tools/GetSpotifyAlbumWithTracksResult";
import GetSpotifyAlbumWithTracksSkeleton from "./tools/GetSpotifyAlbumWithTracksSkeleton";
import { SpotifyAlbum } from "@/lib/tools/getSpotifyAlbum";
import DeleteScheduledActionsSuccess from "./tools/DeleteScheduledActionsSuccess";
import DeleteScheduledActionsSkeleton from "./tools/DeleteScheduledActionsSkeleton";
import { DeleteScheduledActionsResult } from "@/lib/tools/scheduled_actions/deleteScheduledActions";
import UpdateScheduledActionSuccess from "./tools/UpdateScheduledActionSuccess";
import { UpdateScheduledActionResult } from "./tools/UpdateScheduledActionSuccess";
import UpdateScheduledActionSkeleton from "./tools/UpdateScheduledActionSkeleton";

/**
 * Helper function to get the appropriate UI component for a tool call
 */
export function getToolCallComponent(part: ToolUIPart) {
  const { toolCallId } = part as ToolUIPart;
  const toolName = getToolName(part);
  const isSearchWebTool =
    toolName === "search_web" || toolName === "web_deep_research";

  // Handle image generation tools (including nano banana variants)
  if (
    toolName === "generate_image" ||
    toolName === "nano_banana_generate" ||
    toolName === "nano_banana_edit" ||
    toolName === "default_api.nano_banana_generate" ||
    toolName === "default_api.nano_banana_edit"
  ) {
    return (
      <div key={toolCallId} className="skeleton">
        <ImageSkeleton />
      </div>
    );
  } else if (toolName === "generate_mermaid_diagram") {
    return (
      <div key={toolCallId}>
        <MermaidDiagramSkeleton />
      </div>
    );
  } else if (toolName === "create_new_artist") {
    return (
      <div key={toolCallId}>
        <CreateArtistToolCall />
      </div>
    );
  } else if (toolName === "delete_artist") {
    return (
      <div key={toolCallId}>
        <DeleteArtistToolCall />
      </div>
    );
  } else if (toolName === "get_post_comments") {
    return (
      <div key={toolCallId}>
        <CommentsResultSkeleton />
      </div>
    );
  } else if (toolName === "get_segment_fans") {
    return (
      <div key={toolCallId} className="w-full">
        <GetSegmentFansResultSkeleton />
      </div>
    );
  } else if (toolName === "get_youtube_channels") {
    return (
      <div key={toolCallId}>
        <YouTubeAccessSkeleton />
      </div>
    );
  } else if (toolName === "get_youtube_revenue") {
    return (
      <div key={toolCallId}>
        <YouTubeRevenueSkeleton />
      </div>
    );
  } else if (toolName === "get_youtube_channel_video_list") {
    return (
      <div key={toolCallId}>
        <YouTubeChannelVideosListSkeleton />
      </div>
    );
  } else if (toolName === "set_youtube_thumbnail") {
    return (
      <div key={toolCallId}>
        <YouTubeSetThumbnailSkeleton />
      </div>
    );
  } else if (isSearchWebTool) {
    return (
      <div key={toolCallId}>
        <SearchWebSkeleton />
      </div>
    );
  } else if (toolName === "spotify_deep_research") {
    return (
      <div key={toolCallId}>
        <SpotifyDeepResearchSkeleton />
      </div>
    );
  } else if (toolName === "get_spotify_artist_albums") {
    return (
      <div key={toolCallId}>
        <GetSpotifyArtistAlbumsSkeleton />
      </div>
    );
  } else if (toolName === "get_artist_socials") {
    return (
      <div key={toolCallId}>
        <GetArtistSocialsSkeleton />
      </div>
    );
  } else if (toolName === "get_spotify_artist_top_tracks") {
    return (
      <div key={toolCallId}>
        <SpotifyArtistTopTracksSkeleton />
      </div>
    );
  } else if (toolName === "get_scheduled_actions") {
    return (
      <div key={toolCallId}>
        <GetScheduledActionsSkeleton />
      </div>
    );
  } else if (toolName === "get_spotify_album") {
    return (
      <div key={toolCallId}>
        <GetSpotifyAlbumWithTracksSkeleton />
      </div>
    );
  } else if (toolName === "create_scheduled_actions") {
    return (
      <div key={toolCallId}>
        <CreateScheduledActionsSkeleton />
      </div>
    );
  } else if (toolName === "delete_scheduled_actions") {
    return (
      <div key={toolCallId}>
        <DeleteScheduledActionsSkeleton />
      </div>
    );
  } else if (toolName === "update_scheduled_action") {
    return (
      <div key={toolCallId}>
        <UpdateScheduledActionSkeleton />
      </div>
    );
  }

  // Default for other tools
  return (
    <div
      key={toolCallId}
      className="flex items-center gap-1 py-1 px-2 bg-primary/5 rounded-sm border w-fit text-xs"
    >
      <Loader className="h-3 w-3 animate-spin text-primary" />
      <span>Using {getDisplayToolName(toolName)}</span>
    </div>
  );
}

/**
 * Helper function to get the appropriate UI component for a tool result
 */
export function getToolResultComponent(part: ToolUIPart) {
  const { toolCallId, output: result } = part as ToolUIPart;
  const toolName = getToolName(part);
  const isSearchWebTool =
    toolName === "search_web" || toolName === "web_deep_research";

  if (toolName === "generate_image") {
    return (
      <div key={toolCallId}>
        <ImageResult result={result as ImageGenerationResult} />
      </div>
    );
  } else if (
    toolName === "nano_banana_generate" ||
    toolName === "nano_banana_edit" ||
    toolName === "default_api.nano_banana_generate" ||
    toolName === "default_api.nano_banana_edit"
  ) {
    return (
      <div key={toolCallId}>
        <NanoBananaResult
          result={result as NanoBananaGenerateResult | NanoBananaEditResult}
        />
      </div>
    );
  } else if (toolName === "generate_mermaid_diagram") {
    return (
      <div key={toolCallId}>
        <MermaidDiagram result={result as GenerateMermaidDiagramResult} />
      </div>
    );
  } else if (toolName === "create_new_artist") {
    return (
      <div key={toolCallId}>
        <CreateArtistToolResult result={result as CreateArtistResult} />
      </div>
    );
  } else if (toolName === "delete_artist") {
    return (
      <div key={toolCallId}>
        <DeleteArtistToolResult result={result as DeleteArtistResult} />
      </div>
    );
  } else if (toolName === "get_spotify_search") {
    return (
      <div key={toolCallId}>
        <GetSpotifySearchToolResult result={result as SpotifySearchResponse} />
      </div>
    );
  } else if (toolName === "update_account_info") {
    return (
      <div key={toolCallId}>
        <UpdateArtistInfoSuccess result={result as UpdateAccountInfoResult} />
      </div>
    );
  } else if (toolName === "update_artist_socials") {
    return (
      <div key={toolCallId}>
        <UpdateArtistSocialsSuccess
          result={result as UpdateArtistSocialsResult}
        />
      </div>
    );
  } else if (toolName === "generate_txt_file") {
    return (
      <div key={toolCallId}>
        <TxtFileResult result={result as TxtFileGenerationResult} />
      </div>
    );
  } else if (toolName === "get_video_game_campaign_plays") {
    return (
      <div key={toolCallId} className="w-full">
        <GetVideoGameCampaignPlaysResultComponent
          result={result as GetSpotifyPlayButtonClickedResult}
        />
      </div>
    );
  } else if (toolName === "get_post_comments") {
    return (
      <div key={toolCallId}>
        <CommentsResult result={result as CommentsResultData} />
      </div>
    );
  } else if (toolName === "get_segment_fans") {
    return (
      <div key={toolCallId} className="w-full">
        <GetSegmentFansResult result={result as SegmentFansResult} />
      </div>
    );
  } else if (toolName === "youtube_login") {
    return (
      <div key={toolCallId}>
        <YouTubeLoginResult result={result as YouTubeLoginResultType} />
      </div>
    );
  } else if (toolName === "get_youtube_channels") {
    return (
      <div key={toolCallId}>
        <YouTubeChannelsResult result={result as YouTubeChannelInfoResult} />
      </div>
    );
  } else if (toolName === "get_youtube_revenue") {
    return (
      <div key={toolCallId}>
        <YouTubeRevenueResult result={result as YouTubeRevenueResultType} />
      </div>
    );
  } else if (toolName === "get_youtube_channel_video_list") {
    return (
      <div key={toolCallId}>
        <YoutubeChannelVideosListResult
          result={result as YouTubeChannelVideoListResult}
        />
      </div>
    );
  } else if (toolName === "set_youtube_thumbnail") {
    return (
      <div key={toolCallId}>
        <YouTubeSetThumbnailResult
          result={result as YouTubeSetThumbnailResultType}
        />
      </div>
    );
  } else if (isSearchWebTool) {
    // Check if it's a streaming progress update
    if (result && typeof result === 'object' && 'status' in result) {
      const progress = result as SearchProgress;

      if (progress.status === 'searching') {
        return (
          <div key={toolCallId} className="flex flex-col gap-2 py-2 px-3 bg-primary/5 rounded-md border">
            <div className="flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium">Searching the web...</span>
            </div>
            {progress.query && (
              <p className="text-xs text-muted-foreground ml-6">
                {progress.query}
              </p>
            )}
          </div>
        );
      }

      if (progress.status === 'streaming') {
        return (
          <div key={toolCallId} className="flex flex-col gap-2 py-2 px-3 bg-primary/5 rounded-md border">
            <div className="flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium">{progress.message}</span>
            </div>
            {progress.searchResults && progress.searchResults.length > 0 && (
              <div className="ml-6 text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Sources found:</p>
                {progress.searchResults.slice(0, 3).map((source, idx) => (
                  <p key={idx} className="truncate">
                    • {source.title || source.url}
                  </p>
                ))}
              </div>
            )}
            {progress.accumulatedContent && (
              <div className="ml-6 text-xs text-muted-foreground mt-2">
                <ChatMarkdown>{progress.accumulatedContent}</ChatMarkdown>
              </div>
            )}
          </div>
        );
      }

      if (progress.status === 'complete' && progress.accumulatedContent) {
        return (
          <div key={toolCallId}>
            <SearchWebResult
              result={{
                content: [{ type: "text", text: progress.accumulatedContent }],
                isError: false
              }}
            />
          </div>
        );
      }
    }

    // Fallback to regular result
    return (
      <div key={toolCallId}>
        <SearchWebResult result={result as SearchWebResultType} />
      </div>
    );
  } else if (toolName === "spotify_deep_research") {
    return (
      <div key={toolCallId}>
        <SpotifyDeepResearchResult
          result={result as SpotifyDeepResearchResultUIType}
        />
      </div>
    );
  } else if (toolName === "get_artist_socials") {
    return (
      <div key={toolCallId}>
        <GetArtistSocialsResult result={result as ArtistSocialsResultType} />
      </div>
    );
  } else if (toolName === "get_spotify_artist_albums") {
    return (
      <div key={toolCallId}>
        <GetSpotifyArtistAlbumsResult
          result={result as SpotifyArtistAlbumsResultUIType}
        />
      </div>
    );
  } else if (toolName === "get_spotify_artist_top_tracks") {
    return (
      <div key={toolCallId}>
        <SpotifyArtistTopTracksResult
          result={result as SpotifyArtistTopTracksResultType}
        />
      </div>
    );
  } else if (toolName === "get_scheduled_actions") {
    return (
      <div key={toolCallId}>
        <GetScheduledActionsSuccess
          result={result as GetScheduledActionsResult}
        />
      </div>
    );
  } else if (toolName === "create_scheduled_actions") {
    return (
      <div key={toolCallId}>
        <CreateScheduledActionsSuccess
          result={result as CreateScheduledActionsResult}
        />
      </div>
    );
  } else if (toolName === "get_spotify_album") {
    return (
      <div key={toolCallId}>
        <GetSpotifyAlbumWithTracksResult result={result as SpotifyAlbum} />
      </div>
    );
  } else if (toolName === "delete_scheduled_actions") {
    return (
      <div key={toolCallId}>
        <DeleteScheduledActionsSuccess
          result={result as DeleteScheduledActionsResult}
        />
      </div>
    );
  } else if (toolName === "update_scheduled_action") {
    return (
      <div key={toolCallId}>
        <UpdateScheduledActionSuccess
          result={result as UpdateScheduledActionResult}
        />
      </div>
    );
  }

  // Default generic result for other tools
  return (
    <GenericSuccess
      name={getDisplayToolName(toolName)}
      message={
        (result as { message?: string }).message ??
        getToolInfo(toolName).message
      }
    />
  );
}

/**
 * Main ToolComponents component - Export a single object with all tool-related UI components
 */
export const ToolComponents = {
  getToolCallComponent,
  getToolResultComponent,
};

export default ToolComponents;
