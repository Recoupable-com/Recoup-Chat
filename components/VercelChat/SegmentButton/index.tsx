import { Tooltip } from "@/components/common/Tooltip";
import MenuItemIcon from "@/components/MenuItemIcon";
import { Button } from "@/components/ui/button";
import GraphicArrow from "./GraphicArrow";

const ChatInputSegmentCreationButton = () => {
  return (
    <div className="w-full relative flex items-center justify-center">
      <Tooltip content="Create Fan Groups">
        <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
          <MenuItemIcon name="segments" />
          <span className="sr-only">Create Segment</span>
        </Button>
      </Tooltip>
      <GraphicArrow />
    </div>
  );
};

export default ChatInputSegmentCreationButton;
