import MenuItemIcon from "@/components/MenuItemIcon";
import { Button } from "@/components/ui/button";

const ChatInputSegmentCreationButton = () => {
  return (
    <div className="w-full relative flex items-center justify-center">
      <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
        <MenuItemIcon name="segments" />
        <span className="sr-only">Create Segment</span>
      </Button>
    </div>
  );
};

export default ChatInputSegmentCreationButton;
