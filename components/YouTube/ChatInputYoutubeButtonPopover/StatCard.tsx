import { LucideIcon } from "lucide-react";

const StatCard = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number}) => (
  <div className="flex items-center gap-0 md:gap-2 bg-white rounded-lg px-3 md:px-3 py-1.5 md:py-2 border border-red-100">
    <div className="hidden md:flex p-1 bg-red-100 rounded flex-shrink-0">
      <Icon className="h-3 w-3 text-red-600" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground truncate">{label}</p>
      <p className="font-semibold text-xs md:text-sm text-foreground truncate">{value}</p>
    </div>
  </div>
);

export default StatCard;