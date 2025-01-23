import Tooltip from "../Tooltip";
import { useUserProvider } from "@/providers/UserProvder";
import { useRouter } from "next/navigation";
import { ArrowRightFromLine } from "lucide-react";
import Icon from "../Icon";

const MiniMenu = ({
  toggleMenuExpanded,
}: {
  toggleMenuExpanded: () => void;
}) => {
  const { push } = useRouter();
  const { isPrepared } = useUserProvider();
  const goToItem = (link?: string) => {
    if (isPrepared()) push(`/${link || ""}`);
  };

  return (
    <div className="w-full h-full pt-10 pb-4 px-2 gap-3 hidden md:flex">
      <div className="flex flex-col items-center gap-3 grow">
        <button type="button" onClick={() => push(`/`)} className="p-2">
          <Icon name="logo" />
        </button>
        <Tooltip
          id={"new-conversation-tooltip"}
          message="New Chat"
          className="!z-[100]"
        >
          <button
            type="button"
            className="p-2 rounded-md mt-2"
            onClick={() => goToItem("new")}
          >
            <Icon name="plus" />
          </button>
        </Tooltip>
        <Tooltip
          id={"autopilot-tooltip"}
          message="Autopilot"
          className="!z-[100]"
        >
          <button
            type="button"
            className=" p-2 rounded-md mt-2"
            onClick={() => push("/")}
          >
            <Icon name="dashboard" />
          </button>
        </Tooltip>
        <Tooltip id={"agents-tooltip"} message="Agents" className="!z-[100]">
          <button
            type="button"
            className=" p-2 rounded-md"
            onClick={() => goToItem("agents")}
          >
            <Icon name="robot" />
          </button>
        </Tooltip>
        <div className="grow flex items-end justify-center">
          <button type="button" onClick={toggleMenuExpanded}>
            <ArrowRightFromLine />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniMenu;
