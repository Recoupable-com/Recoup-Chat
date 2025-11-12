import { RecentChatSkeleton } from "./RecentChats";

export function RecentChatsSectionSkeleton() {
  return (
    <div className="w-full flex-grow min-h-0 flex flex-col">
      <div className="h-[1px] bg-border w-full mt-1 mb-2 md:mt-2 md:mb-3 shrink-0" />
      <p className="text-xs font-medium text-muted-foreground px-2 shrink-0 mb-2">
        Recent Chats
      </p>
      <div className="overflow-y-auto space-y-1 md:space-y-1.5 flex-grow">
        <RecentChatSkeleton />
      </div>
    </div>
  );
}
