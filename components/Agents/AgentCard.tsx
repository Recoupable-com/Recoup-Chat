import type React from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AgentCreator from "./AgentCreator";
import AgentPreviewDialogButton from "./AgentPreviewDialog";
import AgentEditDialog from "./AgentEditDialog";
import AgentDeleteButton from "./AgentDeleteButton";
import AgentHeart from "./AgentHeart";
import type { AgentTemplateRow } from "@/types/AgentTemplates";
import { useUserProvider } from "@/providers/UserProvder";

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
  // Define action tags that should be displayed in cards
  const actionTags = ["Deep Research", "Send Report", "Email Outreach", "Scheduled Action", "Creative Content"];
  
  // Prefer action tags; otherwise fall back to the first available tag
  const displayedActionTags = agent.tags?.filter(tag => actionTags.includes(tag)) || [];
  const pillTag = displayedActionTags[0] ?? agent.tags?.[0];

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const tag = target.tagName?.toLowerCase();
    const isInteractive =
      target.isContentEditable ||
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      tag === "button";
    if (isInteractive) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(agent);
    }
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const interactiveAncestor = target.closest(
      "button, [role='button'], input, textarea, select, a"
    );
    // Ignore clicks on interactive elements, but allow the card itself (role=button)
    if (
      (interactiveAncestor && interactiveAncestor !== event.currentTarget) ||
      target.isContentEditable
    ) {
      return;
    }
    onClick(agent);
  };

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer transition-colors hover:bg-muted/40 hover:ring-1 hover:ring-primary/20"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
    >
      <ExternalLink
        className="absolute top-2 right-2 h-4 w-4 text-muted-foreground opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
        aria-hidden
      />
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            {pillTag && (
              <Badge variant="secondary" className="w-fit">
                {pillTag}
              </Badge>
            )}
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
              onToggle={() => onToggleFavorite?.(agent.id ?? "", !(agent.is_favourite ?? false))}
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