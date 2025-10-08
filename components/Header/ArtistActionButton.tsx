import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ArtistActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  isVisible: boolean;
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
  asChild?: boolean;
}

const ArtistActionButton = ({
  onClick,
  disabled = false,
  isVisible,
  title,
  ariaLabel,
  children,
  asChild = false,
}: ArtistActionButtonProps) => {
  const buttonClasses = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3",
    "h-6 w-6 p-0 flex-shrink-0 opacity-0 pointer-events-none transition-opacity",
    {
      "opacity-1 pointer-events-auto": isVisible,
    }
  );

  if (asChild) {
    // When used as child of another button, render as div with button styling
    return (
      <div
        onClick={onClick}
        className={cn(buttonClasses, {
          "pointer-events-auto": isVisible,
          "pointer-events-none": !isVisible,
        })}
        title={title}
        aria-label={ariaLabel}
      >
        {children}
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-6 w-6 p-0 flex-shrink-0 opacity-0 pointer-events-none transition-opacity",
        {
          "opacity-1 pointer-events-auto": isVisible,
        }
      )}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
};

export default ArtistActionButton;
