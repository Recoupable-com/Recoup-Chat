import { useUserProvider } from "@/providers/UserProvder";
import UserProfileDropdown from "./UserProfileDropdown";
import UserProfileButtonSkeleton from "./UserProfileButtonSkeleton";
import CreditsProgressAvatar from "./CreditsProgressAvatar";

const UserProfileButton = () => {
  const { email, userData } = useUserProvider();
  if (!userData) return <UserProfileButtonSkeleton />;

  const displayName = userData?.name || email || userData?.wallet || "";
  const organization = email || "";

  return (
    <div
      className="w-full justify-start flex items-center gap-2 h-auto py-1 pl-1 pr-2 rounded-xl border border-transparent hover:border-muted-foreground/20 dark:hover:border-[#444]"
      aria-label="Open user menu"
    >
      <CreditsProgressAvatar />
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm md:text-base font-semibold truncate dark:text-white">
          {displayName}
        </p>
        <p className="text-xs text-muted-foreground dark:text-gray-400 truncate">{organization}</p>
      </div>
      <UserProfileDropdown />
    </div>
  );
};

export default UserProfileButton;
