import { Youtube } from "lucide-react";
import { youtubeLogin } from "@/lib/youtube/youtubeLogin";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConnectYouTubeButtonProps {
  accountId?: string;
  className?: string;
  size?: "sm" | "lg" | "default" | "icon";
  disabled?: boolean;
  dense?: boolean;
}

export const ConnectYouTubeButton = ({
  accountId,
  className = "",
  size = "default",
  disabled = false,
  dense = false,
}: ConnectYouTubeButtonProps) => (
  <Button
    onClick={() => youtubeLogin(accountId)}
    className={cn("bg-red-600 hover:bg-red-700 text-white flex items-center justify-center", {
        "rounded-full px-2": dense,
    }, className)}
    size={size}
    disabled={disabled || !accountId}
  >
    <Youtube className={cn("h-4 w-4", {
        "mr-0 md:mr-0": dense,
    })} />
    <span className={cn("text-xs md:text-sm", {
        "hidden": dense,
    })}>Connect YouTube <span className="hidden md:inline">Account</span></span>
  </Button>
);