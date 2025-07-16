import { Button } from "@/components/ui/button";
import { LogOut, XIcon } from "lucide-react";

const YoutubeLogoutButton = ({
  artistAccountId,
}: {
  artistAccountId: string;
}) => {
  return (
    <div className="flex flex-col gap-1 cursor-pointer md:relative absolute bottom-0 -top-3 -right-1 md:top-0 md:right-0 md:justify-between md:pb-2">
      <label className={"text-sm"}>&nbsp;</label>
      <Button size="icon" className="md:w-9 md:h-9 w-4 h-4 bg-transparent text-red-500 md:bg-black md:text-white md:px-4 md:py-2 px-1 py-1">
        <LogOut className="hidden md:block"/>
        <XIcon className="md:hidden w-4 h-4"/>
      </Button>
    </div>
  );
};

export default YoutubeLogoutButton;
