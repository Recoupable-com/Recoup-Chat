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

const Menu = ({ toggleMenuExpanded }: { toggleMenuExpanded: () => void }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { email, isPrepared } = useUserProvider();
  const isAgents = pathname.includes("/agents");
  const isSegments = pathname.includes("/segments");

  const goToItem = (link?: string) => {
    if (isPrepared()) {
      push(`/${link || uuidV4()}`);
    }
  };

  return (
    <div className="w-full h-screen pt-10 pb-4 pl-6 pr-2 hidden md:flex flex-col">
      <button
        className="mt-2 shrink-0"
        onClick={() => push("/")}
        type="button"
        aria-label="Home"
      >
        <Logo />
      </button>
      <div className="flex flex-col gap-1 w-full pb-2 mt-4">
        <Button
          variant="outline"
          className="rounded-xl w-full"
          onClick={() => goToItem("chat")}
        >
          {email ? "New Chat" : "Sign In"}
        </Button>
        <AgentsNavItem isActive={isAgents} onClick={() => goToItem("agents")} />
        <ScheduledActionsNavItem isActive={false} onClick={() => goToItem("scheduled-actions")} />
        <FanGroupNavItem isActive={isSegments} onClick={() => goToItem("segments")} />
      </div>

      <div className="flex flex-col flex-grow min-h-0">
        {!email ? <RecentChatsSectionSkeleton /> : <RecentChats toggleModal={toggleMenuExpanded} />}

        <div className="shrink-0 mt-auto">
          {email && <UnlockPro />}
          <UserInfo toggleMenuExpanded={toggleMenuExpanded} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
