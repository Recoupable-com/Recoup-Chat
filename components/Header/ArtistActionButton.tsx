import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ArtistActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  isVisible: boolean;
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
}

const ArtistActionButton = ({
  onClick,
  disabled = false,
  isVisible,
  title,
  ariaLabel,
  children,
}: ArtistActionButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "h-6 w-6 p-0 flex-shrink-0 opacity-0 pointer-events-none transition-opacity",
      {
        "opacity-100 pointer-events-auto": isVisible,
      }
    )}
    title={title}
    aria-label={ariaLabel}
  >
    {children}
  </Button>
);

export default ArtistActionButton;
