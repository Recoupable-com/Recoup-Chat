import { ThumbsUp, ThumbsDown, Bookmark, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PulseCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

const PulseCard = ({ imageUrl, title, description }: PulseCardProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={imageUrl}
          alt={title}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          <p className="text-white/80 text-sm mt-1">{description}</p>
        </div>
      </div>
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
    </div>
  );
};

export default PulseCard;
