import { ThumbsUp, ThumbsDown, Bookmark, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

const PulseCardActions = () => {
  return (
    <div className="flex gap-1">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Bookmark className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Share className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PulseCardActions;
