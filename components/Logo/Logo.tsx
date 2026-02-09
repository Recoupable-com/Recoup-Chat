import Image from "next/image";
import { cn } from "@/lib/utils";

const Logo = ({ isExpanded = false }: { isExpanded?: boolean }) => {
  return (
    <div className="flex items-center gap-0">
      {/* Icon — always visible, never moves */}
      <Image
        src="/brand/icon-lightmode.svg"
        alt="Recoup Logo"
        width={223}
        height={223}
        priority
        className="w-7 h-7 shrink-0 dark:hidden"
      />
      <Image
        src="/brand/icon-darkmode.svg"
        alt="Recoup Logo"
        width={223}
        height={223}
        priority
        className="w-7 h-7 shrink-0 hidden dark:block"
      />
      {/* Brand name — fades in/out alongside sidebar */}
      <span className={cn(
        "font-semibold text-base text-foreground whitespace-nowrap overflow-hidden transition-all duration-200 font-heading",
        isExpanded ? "opacity-100 max-w-[150px] ml-2" : "opacity-0 max-w-0 ml-0"
      )}>
        Recoupable
      </span>
    </div>
  );
};

export default Logo;
