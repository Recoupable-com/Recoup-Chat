import { RecentChatSkeleton } from "./RecentChats";

export function RecentChatsSectionSkeleton() {
  return (
    <div className="w-full flex-grow min-h-0 flex flex-col">
      <div className="h-[1px] bg-grey-light dark:bg-dark-border w-full mt-1 mb-2 md:mt-2 md:mb-3 shrink-0" />
      <p className="text-sm mb-1 md:mb-2 font-inter text-grey-dark dark:text-gray-400 px-2 shrink-0">
        Recent Chats
      </p>
      <div className="overflow-y-auto space-y-1 md:space-y-1.5 flex-grow">
        <RecentChatSkeleton />
      </div>
    </div>
  );
}
