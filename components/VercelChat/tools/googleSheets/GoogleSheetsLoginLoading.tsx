import { Loader } from "lucide-react";

export function GoogleSheetsLoginLoading() {
  return (
    <div className="flex items-center gap-1 py-1 px-2 bg-muted/50 rounded-sm border border-border w-fit text-xs text-muted-foreground">
      <Loader className="h-3 w-3 animate-spin text-foreground" />
      <span>Initializing Google Sheets login...</span>
    </div>
  );
}

export default GoogleSheetsLoginLoading;
