import type React from "react";
import { ExternalLink} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import AgentPreviewDialogButton from "./AgentPreviewDialog";
import AgentDeleteButton from "./AgentDeleteButton";

interface Agent {
  title: string;
  description: string;
  prompt: string;
  tags?: string[];
  status?: string;
  is_private?: boolean;
  creator?: string | null;
  id?: string;
  created_at?: string;
}

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  // Define action tags that should be displayed in cards
  const actionTags = ["Deep Research", "Send Report", "Email Outreach", "Scheduled Action", "Creative Content"];
  
  // Prefer action tags; otherwise fall back to the first available tag
  const displayedActionTags = agent.tags?.filter(tag => actionTags.includes(tag)) || [];
  const pillTag = displayedActionTags[0] ?? agent.tags?.[0];

  return (
    <Card className="relative overflow-hidden">
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
          <div className="flex gap-1">
            <AgentPreviewDialogButton agent={agent} />
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-transparent rounded-xl"
              onClick={() => onClick(agent)}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Open link</span>
            </Button>
            <AgentDeleteButton id={agent.id ?? ""} creatorId={agent.creator} />
          </div>

          {/* Brand watermark */}
          <div className="flex items-center">
            {agent.creator === null && (
              <Image
                src="/Recoup_Icon_Wordmark_Black.svg"
                alt="Recoup"
                width={64}
                height={18}
                className="opacity-70 h-[14px] w-auto"
                priority={false}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard; 