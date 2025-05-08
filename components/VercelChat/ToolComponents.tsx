import { ImageSkeleton } from "@/components/ui/ImageSkeleton";
import { ImageResult } from "@/components/ui/ImageResult";
import { ImageGenerationResult } from "@/lib/tools/generateImage";
import MermaidDiagram from "../Chat/mermaid/MermaidDiagram";
import { GenerateMermaidDiagramResult } from "@/lib/tools/generateMermaidDiagram";
import { MermaidDiagramSkeleton } from "../ui/MermaidDiagramSkeleton";
import CreateArtistToolCall from "./tools/CreateArtistToolCall";
import CreateArtistToolResult from "./tools/CreateArtistToolResult";
import { CreateArtistResult } from "@/lib/tools/createArtist";
import DeleteArtistToolCall from "./tools/DeleteArtistToolCall";
import DeleteArtistToolResult from "./tools/DeleteArtistToolResult";
import { DeleteArtistResult } from "@/lib/tools/deleteArtist";
import GetSpotifySearchToolResult from "./tools/GetSpotifySearchToolResult";
import { SpotifySearchResponse } from "@/types/spotify";
import { ToolInvocation } from "ai";
import { Loader } from "lucide-react";
import { getDisplayToolName } from "@/lib/tools/get-tools-name";

/**
 * Interface for tool call props
 */
interface ToolCallProps {
  toolName: string;
  toolCallId: string;
}

/**
 * Union type for all possible tool results
 */
type ToolResult =
  | ImageGenerationResult
  | GenerateMermaidDiagramResult
  | CreateArtistResult
  | DeleteArtistResult
  | Record<string, unknown>;

/**
 * Interface for tool result props
 */
interface ToolResultProps extends ToolCallProps {
  result: ToolResult;
}

/**
 * Helper function to get the appropriate UI component for a tool call
 */

export function getToolCallComponent({ toolName, toolCallId }: ToolInvocation) {
  // Handle generate_image tool call
  if (toolName === "generate_image") {
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
  }

  // Default for other tools
  return (
    <div key={toolCallId} className="flex items-center gap-2 p-3 bg-background">
      <Loader className="h-4 w-4 animate-spin text-primary" />
      <div className="text-sm font-medium">{getDisplayToolName(toolName)}</div>
    </div>
  );
}

/**
 * Helper function to get the appropriate UI component for a tool result
 */
export function getToolResultComponent({
  toolName,
  toolCallId,
  result,
}: ToolResultProps) {
  if (toolName === "generate_image") {
    return (
      <div key={toolCallId}>
        <ImageResult result={result as ImageGenerationResult} />
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
  }
}

/**
 * Main ToolComponents component - Export a single object with all tool-related UI components
 */
export const ToolComponents = {
  getToolCallComponent,
  getToolResultComponent,
};

export default ToolComponents;
