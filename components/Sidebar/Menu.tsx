import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useUserProvider } from "@/providers/UserProvder";
import RecentChats from "../Sidebar/RecentChats";
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
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { SquarePen } from "lucide-react";

const Menu = ({ isExpanded }: { isExpanded: boolean }) => {
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
    <div className="w-full h-screen pt-3 pb-2 px-2 hidden md:flex flex-col">
      {/* Logo */}
      <Link
        href="/"
        className={cn(
          "shrink-0 hover:opacity-80 transition-all duration-200",
          isExpanded ? "pl-[7px]" : "self-center"
        )}
        aria-label="Home"
      >
        <Logo isExpanded={isExpanded} />
      </Link>

      {/* Navigation Section */}
      <div className="flex flex-col gap-0.5 w-full mt-2">
        <button
          type="button"
          className={cn(
            "inline-flex items-center h-8 rounded-lg whitespace-nowrap overflow-hidden transition-all duration-200 text-sm font-normal text-foreground hover:bg-muted",
            isExpanded ? "w-full justify-start gap-2 px-3" : "w-8 justify-center mx-auto gap-0"
          )}
          onClick={() => goToItem("chat")}
          aria-label={email ? "New Chat" : "Sign In"}
        >
          <div className="w-[21px] flex justify-center items-center shrink-0">
            <SquarePen className="size-4" />
          </div>
          <span className={cn(
            "overflow-hidden transition-all duration-200",
            isExpanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
          )}>
            {email ? "New Chat" : "Sign In"}
          </span>
        </button>
        <AgentsNavItem
          isActive={isAgents}
          isExpanded={isExpanded}
          onClick={() => goToItem("agents")}
        />
        <TasksNavItem
          isActive={isTasks}
          isExpanded={isExpanded}
          onClick={() => goToItem("tasks")}
        />
        <FanGroupNavItem
          isActive={isSegments}
          isExpanded={isExpanded}
          onClick={() => goToItem("segments")}
        />
        <FilesNavItem
          isActive={isFiles}
          isExpanded={isExpanded}
          onClick={() => goToItem("files")}
        />
      </div>

      {/* Recent Chats & Unlock Pro — smoothly fade in/out */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="flex flex-col flex-grow min-h-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, exit: { duration: 0.05 } }}
          >
            {!email ? (
              <RecentChatsSectionSkeleton />
            ) : (
              <RecentChats toggleModal={() => {}} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile — always visible (avatar shows when collapsed) */}
      <div className="shrink-0 mt-auto px-0.5 pb-1">
        <UserInfo isExpanded={isExpanded} />
      </div>
    </div>
  );
};

export default Menu;
