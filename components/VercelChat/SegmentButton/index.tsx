import { Tooltip } from "@/components/common/Tooltip";
import MenuItemIcon from "@/components/MenuItemIcon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import { FAN_GROUPS_PROMPT } from "@/lib/consts";

const ChatInputSegmentCreationButton = () => {
  const { push } = useRouter();
  const { messages } = useVercelChatContext();

  const handleSegmentClick = () => {
    push(`/chat?q=${encodeURIComponent(FAN_GROUPS_PROMPT)}`);
  };

  const shouldVisible = messages.length === 0;

  if (!shouldVisible) return null;

  return (
    <div className="w-full relative flex items-center justify-center">
      <Tooltip content="Create Fan Groups">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-7 h-7"
          onClick={handleSegmentClick}
        >
          <MenuItemIcon name="segments" />
          <span className="sr-only">Create Segment</span>
        </Button>
      </Tooltip>
    </div>
  );
};

export default ChatInputSegmentCreationButton;
