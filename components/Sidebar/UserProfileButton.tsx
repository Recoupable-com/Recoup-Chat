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
      className="w-full justify-start flex items-center gap-1.5 h-12 px-1.5 rounded-xl border border-transparent hover:border-muted-foreground/20 dark:hover:border-[#444]"
      aria-label="Open user menu"
    >
      <CreditsProgressAvatar />
      <div className="flex-1 min-w-0 text-left overflow-hidden">
        <p className="text-xs font-semibold truncate dark:text-white leading-tight">
          {displayName}
        </p>
        <p className="text-[10px] text-muted-foreground dark:text-muted-foreground truncate leading-tight" title={organization}>
          {organization}
        </p>
      </div>
      <UserProfileDropdown />
    </div>
  );
};

export default UserProfileButton;
