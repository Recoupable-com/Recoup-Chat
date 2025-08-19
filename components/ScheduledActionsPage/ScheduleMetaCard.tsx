import { cn } from "@/lib/utils";

type Variant = "default" | "green" | "blue" | "orange" | "purple";

const variantStyles: Record<Variant, string> = {
  default: "bg-white border-gray-200",
  green: "bg-green-50 border-green-200",
  blue: "bg-blue-50 border-blue-200",
  orange: "bg-orange-50 border-orange-200",
  purple: "bg-purple-50 border-purple-200",
};

const variantTextStyles: Record<Variant, string> = {
  default: "text-gray-700",
  green: "text-green-700",
  blue: "text-blue-700",
  orange: "text-orange-700",
  purple: "text-purple-700",
};

const variantValueStyles: Record<Variant, string> = {
  default: "text-gray-900",
  green: "text-green-900",
  blue: "text-blue-900",
  orange: "text-orange-900",
  purple: "text-purple-900",
};

const ScheduleMetaCard = ({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: Variant;
}) => {
  return (
    <div className={cn("rounded-md p-3 border", variantStyles[variant])}>
      <div className="flex items-center justify-between mb-1">
        <span className={cn("text-xs font-medium uppercase tracking-wide", variantTextStyles[variant])}>
          {label}
        </span>
      </div>
      <p className={cn("text-xs font-medium leading-tight", variantValueStyles[variant])}>
        {value}
      </p>
    </div>
  );
};

export default ScheduleMetaCard;
