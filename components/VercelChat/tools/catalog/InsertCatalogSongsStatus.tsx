import { Check, X } from "lucide-react";

interface InsertCatalogSongsStatusProps {
  hasError: boolean;
  errorMessage?: string | null;
  successMessage?: string;
}

/**
 * Displays the status of catalog song insertion
 * Shows either success or error state with appropriate icon and message
 */
export default function InsertCatalogSongsStatus({
  hasError,
  errorMessage,
  successMessage,
}: InsertCatalogSongsStatusProps) {
  if (hasError) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-destructive/10">
          <X className="h-3 w-3 text-destructive" />
        </div>
        <span className="text-sm text-destructive">{errorMessage}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10">
        <Check className="h-3 w-3 text-green-600" />
      </div>
      <span className="text-sm text-muted-foreground">
        {successMessage || "Songs added to catalog"}
      </span>
    </div>
  );
}
