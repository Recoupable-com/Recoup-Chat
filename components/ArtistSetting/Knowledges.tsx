import { useArtistProvider } from "@/providers/ArtistProvider";
import { X } from "lucide-react";
import Icon, { IconsType } from "../Icon";
import getKnowledgeIcon from "@/lib/getKnowledgeIcon";
import { Button } from "@/components/ui/button";
import KnowledgeDialog from "./KnowledgeDialog";

type KnowledgeBaseItem = {
  url: string;
  type: string;
  name: string;
};

const Knowledges = () => {
  const { bases, handleDeleteKnowledge } = useArtistProvider();
  return (
    <>
      {bases.map((base: KnowledgeBaseItem, index: number) => (
        <div
          key={index}
          className="group flex w-full items-center justify-between rounded-sm border border-border/40 px-1 py-0.5 transition-colors hover:bg-accent"
        >
          <KnowledgeDialog name={base.name} url={base.url}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex min-w-0 items-center gap-1 px-0.5 h-7 text-xs"
            >
              <Icon name={getKnowledgeIcon(base.type) as IconsType} />
              <span className="truncate max-w-[200px] text-xs">{base.name}</span>
            </Button>
          </KnowledgeDialog>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove file"
            className="h-7 w-7 opacity-70 transition-colors group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => handleDeleteKnowledge(index)}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
    </>
  );
};

export default Knowledges;
