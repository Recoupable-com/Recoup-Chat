import { usePathname, useRouter } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import RecentChats from "../Sidebar/RecentChats";
import UnlockPro from "./UnlockPro";
import UserInfo from "../Sidebar/UserInfo";
import Logo from "../Logo";
import { v4 as uuidV4 } from "uuid";
import { Button } from "../ui/button";
import FanGroupNavItem from "./FanGroupNavItem";
import AgentsNavItem from "./AgentsNavItem";
import { RecentChatsSectionSkeleton } from "./RecentChatsSectionSkeleton";
import ScheduledActionsNavItem from "./ScheduledActionsNavItem";
import FilesNavItem from "./FilesNavItem";
import { useEffect } from "react";

const Menu = ({ toggleMenuExpanded }: { toggleMenuExpanded: () => void }) => {
  const { push, prefetch } = useRouter();
  const pathname = usePathname();
  const { email, isPrepared } = useUserProvider();
  const isAgents = pathname.includes("/agents");
  const isSegments = pathname.includes("/segments");
  const isScheduledActions = pathname.includes("/scheduled-actions");
  const isFiles = pathname.includes("/files");

  const goToItem = (link?: string) => {
    if (isPrepared()) {
      push(`/${link || uuidV4()}`);
    }
  };

  useEffect(() => {
    prefetch('/files');
    prefetch('/agents');
  }, [prefetch]);

  return (
    <div className="w-full h-screen pt-9 pb-6 pl-6 pr-3 hidden md:flex flex-col">
      <button
        className="shrink-0 mb-0"
        onClick={() => push("/")}
        type="button"
        aria-label="Home"
      >
        <Logo />
      </button>
      
      {/* Navigation Section */}
      <div className="flex flex-col gap-3 w-full">
        <Button
          variant="outline"
          className="rounded-xl w-full"
          onClick={() => goToItem("chat")}
        >
          {email ? "New Chat" : "Sign In"}
        </Button>
        
        <div className="flex flex-col gap-2">
          <AgentsNavItem isActive={isAgents} onClick={() => goToItem("agents")} />
          <ScheduledActionsNavItem isActive={isScheduledActions} onClick={() => goToItem("scheduled-actions")} />
          <FanGroupNavItem isActive={isSegments} onClick={() => goToItem("segments")} />
          <FilesNavItem isActive={isFiles} onClick={() => goToItem("files")} />
        </div>
      </div>

      {/* Recent Chats Section */}
      <div className="flex flex-col flex-grow min-h-0">
        {!email ? <RecentChatsSectionSkeleton /> : <RecentChats toggleModal={toggleMenuExpanded} />}

        {/* Bottom Section */}
        <div className="shrink-0 pt-4 border-t border-gray-100">
          <UnlockPro />
          <UserInfo toggleMenuExpanded={toggleMenuExpanded} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
