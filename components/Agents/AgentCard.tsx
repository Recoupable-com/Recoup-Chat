import type React from "react";
import { ExternalLink, Users, Lock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AgentCreator from "./AgentCreator";
import AgentPreviewDialogButton from "./AgentPreviewDialog";
import AgentEditDialog from "./AgentEditDialog";
import AgentDeleteButton from "./AgentDeleteButton";
import AgentHeart from "./AgentHeart";
import type { AgentTemplateRow } from "@/types/AgentTemplates";
import { useUserProvider } from "@/providers/UserProvder";
import { useAgentCard } from "./useAgentCard";

type Agent = AgentTemplateRow;

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
  onToggleFavorite?: (agentId: string, nextFavourite: boolean) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onClick,
  onToggleFavorite
}) => {
  const { userData } = useUserProvider();

  const {
    isSharedWithUser,
    isPrivateNotOwned,
    pillTag,
    handleCardKeyDown,
    handleCardClick,
    handleToggleFavorite
  } = useAgentCard({
    agent,
    onClick,
    onToggleFavorite
  });

  return (
    <Card
      className={`group relative overflow-hidden cursor-pointer transition-colors hover:bg-muted/40 hover:ring-1 hover:ring-primary/20 ${
        isSharedWithUser ? 'ring-1 ring-blue-200' : ''
      }`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
    >
      {/* Status indicator bar */}
      {isSharedWithUser && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
      )}
      {isPrivateNotOwned && !isSharedWithUser && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-400" />
      )}
      <ExternalLink
        className="absolute top-2 right-2 h-4 w-4 text-muted-foreground opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
        aria-hidden
      />
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="w-fit">
                {pillTag || "General"}
              </Badge>
              {isSharedWithUser && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-blue-50 border-blue-200 text-blue-700">
                  <Users className="h-3 w-3" />
                  Shared
                </Badge>
              )}
              {isPrivateNotOwned && !isSharedWithUser && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-gray-50 border-gray-200 text-gray-600">
                  <Lock className="h-3 w-3" />
                  Private
                </Badge>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-balance line-clamp-1">{agent.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 text-pretty line-clamp-2 min-h-[2.5rem]">
                {agent.description}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pt-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <AgentHeart
              isFavorited={!!agent.is_favourite}
              onToggle={() => handleToggleFavorite(agent.id ?? "", !(agent.is_favourite ?? false))}
            />
            {userData?.id && userData.id === agent.creator ? (
              <AgentEditDialog agent={agent} />
            ) : (
              <AgentPreviewDialogButton agent={agent} />
            )}
            <AgentDeleteButton id={agent.id ?? ""} creatorId={agent.creator} />
          </div>

          {/* Creator avatar or brand */}
          <AgentCreator creatorId={agent.creator} className="flex items-center" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard; 