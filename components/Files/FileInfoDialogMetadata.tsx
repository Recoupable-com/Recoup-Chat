import { formatBytes } from "@/lib/utils/formatBytes";
import FileRelativePath from "./FileRelativePath";
import type { FileRow } from "@/components/Files/types";

type FileInfoDialogMetadataProps = {
  file: FileRow;
};

export default function FileInfoDialogMetadata({ file }: FileInfoDialogMetadataProps) {
  return (
    <div className="w-full sm:w-64 border-t sm:border-t-0 sm:border-l bg-background overflow-auto">
      <div className="p-3 sm:p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Metadata
        </h3>
        <div className="space-y-3">
          <div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Type</div>
            <div className="text-xs sm:text-sm font-medium">
              {file.is_directory ? "Folder" : "File"}
            </div>
          </div>
          {!file.is_directory && (
            <div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Size</div>
              <div className="text-xs sm:text-sm font-medium">{formatBytes(file.size_bytes)}</div>
            </div>
          )}
          <div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">MIME</div>
            <div className="text-xs sm:text-sm font-medium break-words">
              {file.mime_type || "Unknown"}
            </div>
          </div>
          <div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Path</div>
            <div className="text-[10px] sm:text-xs font-mono break-all">
              <FileRelativePath storageKey={file.storage_key} isDirectory={file.is_directory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

