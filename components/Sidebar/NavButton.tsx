import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import MenuItemIcon from "../MenuItemIcon";
import { IconsType } from "../Icon";

interface NavButtonProps {
  icon: IconsType;
  label: string;
  isActive: boolean;
  isExpanded?: boolean;
  onClick: () => void;
  shouldRender?: boolean;
  "aria-label"?: string;
  onHover?: () => void;
}

const NavButton = ({
  icon,
  label,
  isActive,
  isExpanded = true,
  onClick,
  shouldRender = true,
  "aria-label": ariaLabel,
  onHover,
}: NavButtonProps) => {
  if (!shouldRender) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size={isExpanded ? "sm" : "icon"}
      onClick={onClick}
      onMouseEnter={onHover}
      className={cn(
        "rounded-lg whitespace-nowrap overflow-hidden transition-all duration-200 h-8 relative text-sm font-normal",
        isExpanded ? "w-full flex justify-start gap-2 px-3" : "w-8 mx-auto gap-0",
        {
          "bg-muted text-foreground hover:bg-muted": isActive,
          "text-foreground hover:bg-muted": !isActive,
        }
      )}
      aria-label={ariaLabel || label}
    >
      {/* Active page accent bar */}
      {isActive && isExpanded && (
        <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#345A5D]" />
      )}
      <MenuItemIcon name={icon} />
      <span className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
      )}>
        {label}
      </span>
    </Button>
  );
};

export default NavButton; 