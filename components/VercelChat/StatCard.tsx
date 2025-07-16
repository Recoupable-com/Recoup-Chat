import { LucideIcon } from "lucide-react";

const StatCard = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number}) => (
  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-red-100">
    <div className="p-1 bg-red-100 rounded">
      <Icon className="h-3 w-3 text-red-600" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-sm text-gray-900">{value}</p>
    </div>
  </div>
);

export default StatCard;