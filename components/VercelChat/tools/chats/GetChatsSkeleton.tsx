import { MessageSquare } from "lucide-react";

const GetChatsSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm max-w-md animate-pulse">
      <div className="px-4 py-3 border-b border-border bg-muted rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <div className="h-4 bg-muted-foreground/20 rounded w-24" />
        </div>
        <div className="h-3 bg-muted-foreground/20 rounded w-40 mt-2" />
      </div>

      <div className="p-3 space-y-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-md bg-muted/50"
          >
            <div className="h-4 w-4 bg-muted-foreground/20 rounded" />
            <div className="h-4 bg-muted-foreground/20 rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetChatsSkeleton;
