import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import MenuItemIcon from "../MenuItemIcon";
import { IconsType } from "../Icon";

interface NavButtonProps {
  icon: IconsType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  shouldRender?: boolean;
  "aria-label"?: string;
  onHover?: () => void;
}

const NavButton = ({
  icon,
  label,
  isActive,
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
      onClick={onClick}
      onMouseEnter={onHover}
      className={cn("rounded-xl w-full flex justify-start", {
        "bg-muted  text-black dark:text-white ring-1 ring-border dark:ring-dark-border-light hover:bg-muted dark:hover:bg-dark-bg-tertiary": isActive,
        "text-black dark:text-muted-foreground hover:bg-muted dark:hover:bg-dark-bg-tertiary hover:text-black dark:hover:text-white hover:ring-1 hover:ring-border dark:hover:ring-dark-border-light": !isActive,
      })}
      aria-label={ariaLabel}
    >
      <MenuItemIcon name={icon} />
      {label}
    </Button>
  );
};

export default NavButton; 