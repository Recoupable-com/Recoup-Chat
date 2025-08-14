import { useUserProvider } from "@/providers/UserProvder";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const UserProfileButton = () => {
  const { email, toggleModal, userData } = useUserProvider();

  if (!userData) return null;

  const displayName = userData?.name || email || userData?.wallet || "";
  const organization = email || "";
  const initials = displayName
    .split(" ")
    .map((part: string) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Button
      variant="ghost"
      className="w-full justify-start items-center gap-2 h-auto py-1 pl-1 pr-2 rounded-xl border border-transparent hover:border-muted-foreground/20"
      type="button"
      onClick={toggleModal}
      aria-label="Open user menu"
    >
      <Avatar className="h-8 w-8 md:h-9 md:w-9 ring-2 ring-muted-foreground/20">
        <AvatarImage
          src={userData?.image || "https://i.imgur.com/QCdc8Ai.jpg"}
          alt="User avatar"
        />
        <AvatarFallback>{initials || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm md:text-base font-semibold truncate">{displayName}</p>
        <p className="text-xs text-muted-foreground truncate">{organization}</p>
      </div>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground ml-auto" />
    </Button>
  );
};

export default UserProfileButton;
