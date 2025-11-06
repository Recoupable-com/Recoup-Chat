import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
import TasksNavItem from "./TasksNavItem";
import FilesNavItem from "./FilesNavItem";
import { useEffect } from "react";

const Menu = ({ toggleMenuExpanded }: { toggleMenuExpanded: () => void }) => {
  const { push, prefetch } = useRouter();
  const pathname = usePathname();
  const { email, isPrepared } = useUserProvider();
  const isAgents = pathname.includes("/agents");
  const isSegments = pathname.includes("/segments");
  const isTasks = pathname.includes("/tasks");
  const isFiles = pathname.includes("/files");

  const goToItem = (link?: string) => {
    if (isPrepared()) {
      push(`/${link || uuidV4()}`);
    }
  };

  useEffect(() => {
    prefetch("/files");
    prefetch("/agents");
  }, [prefetch]);

  return (
    <div className="w-full h-screen pt-4 pb-2 px-2.5 hidden md:flex flex-col">
      <Link
        href="/"
        className="shrink-0 mb-0 hover:opacity-80 transition-opacity duration-200 w-fit"
        aria-label="Home"
      >
        <Logo />
      </Link>

      {/* Navigation Section */}
      <div className="flex flex-col gap-3 w-full mt-2">
        <Button
          variant="outline"
          className="rounded-xl w-full"
          onClick={() => goToItem("chat")}
        >
          {email ? "New Chat" : "Sign In"}
        </Button>

        <div className="flex flex-col gap-1">
          <AgentsNavItem
            isActive={isAgents}
            onClick={() => goToItem("agents")}
          />
          <TasksNavItem isActive={isTasks} onClick={() => goToItem("tasks")} />
          <FanGroupNavItem
            isActive={isSegments}
            onClick={() => goToItem("segments")}
          />
          <FilesNavItem isActive={isFiles} onClick={() => goToItem("files")} />
        </div>
      </div>

      {/* Recent Chats Section */}
      <div className="flex flex-col flex-grow min-h-0">
        {!email ? (
          <RecentChatsSectionSkeleton />
        ) : (
          <RecentChats toggleModal={toggleMenuExpanded} />
        )}

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-gray-100 mx-auto">
          <UnlockPro />
          <UserInfo toggleMenuExpanded={toggleMenuExpanded} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
