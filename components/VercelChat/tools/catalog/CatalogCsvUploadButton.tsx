import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CatalogCsvUploadButtonProps {
  isUploading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * CSV file upload button for catalog songs
 * Accepts CSV files with catalog_id and isrc columns
 */
export default function CatalogCsvUploadButton({
  isUploading,
  onFileSelect,
}: CatalogCsvUploadButtonProps) {
  return (
    <div className="mt-2 pt-3 border-t">
      <label htmlFor="csv-upload">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          className="w-full"
          onClick={() => document.getElementById("csv-upload")?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading CSV...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV File
            </>
          )}
        </Button>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={onFileSelect}
          className="hidden"
        />
      </label>
      <p className="text-xs text-muted-foreground mt-1.5 px-1">
        CSV must include{" "}
        <code className="text-[10px] bg-muted px-1 py-0.5 rounded">
          catalog_id
        </code>{" "}
        and{" "}
        <code className="text-[10px] bg-muted px-1 py-0.5 rounded">isrc</code>{" "}
        columns
      </p>
    </div>
  );
}
