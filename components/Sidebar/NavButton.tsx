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
  if (!shouldRender) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn("rounded-xl w-full h-10 flex justify-start gap-3 px-3 font-medium", {
        "bg-gray-100 hover:bg-gray-150 text-gray-900": isActive,
        "hover:bg-gray-50 text-gray-700": !isActive,
      })}
      aria-label={ariaLabel}
    >
      <MenuItemIcon name={icon} />
      {label}
    </Button>
  );
};

export default NavButton; 