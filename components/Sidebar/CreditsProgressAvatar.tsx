import { AnimatedCircularProgressBar } from "../ui/animated-circular-progress-bar";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserProvider } from "@/providers/UserProvder";

const CreditsProgressAvatar = () => {
  const { totalCredits, credits } = usePaymentProvider();
  const { userData, email } = useUserProvider();

  const displayName = userData?.name || email || userData?.wallet || "";

  const initials = displayName
    .split(" ")
    .map((part: string) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative group">
      <AnimatedCircularProgressBar
        max={totalCredits}
        min={0}
        value={credits}
        gaugePrimaryColor="hsl(var(--primary))"
        gaugeSecondaryColor="hsl(var(--muted))"
        className="size-10 text-xs"
      />
      <Avatar className="absolute inset-0 m-auto h-8 w-8 md:h-9 md:w-9 transition-opacity duration-200 group-hover:opacity-0">
        <AvatarImage
          src={userData?.image || "https://i.imgur.com/QCdc8Ai.jpg"}
          alt="User avatar"
        />
        <AvatarFallback>{initials || "U"}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default CreditsProgressAvatar;
