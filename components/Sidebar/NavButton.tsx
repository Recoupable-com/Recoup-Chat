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
}

const NavButton = ({
  icon,
  label,
  isActive,
  onClick,
  shouldRender = true,
  "aria-label": ariaLabel,
}: NavButtonProps) => {
  // Don't render if shouldRender is false
  if (!shouldRender) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn("rounded-xl w-full flex justify-start", {
        "bg-gray-200 hover:bg-gray-200/70": isActive,
      })}
      aria-label={ariaLabel}
    >
      <MenuItemIcon name={icon} />
      {label}
    </Button>
  );
};

export default NavButton; 