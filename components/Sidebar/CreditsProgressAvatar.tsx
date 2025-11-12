import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserProvider } from "@/providers/UserProvder";

const CreditsProgressAvatar = () => {
  const { userData, email } = useUserProvider();

  const displayName = userData?.name || email || userData?.wallet || "";

  const initials = displayName
    .split(" ")
    .map((part: string) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage
        src={userData?.image || "https://i.imgur.com/QCdc8Ai.jpg"}
        alt="User avatar"
      />
      <AvatarFallback>{initials || "U"}</AvatarFallback>
    </Avatar>
  );
};

export default CreditsProgressAvatar;
