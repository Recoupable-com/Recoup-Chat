"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useMemo } from "react";
import ArtistAccessSelector from "./ArtistAccessSelector";
import { useUserProvider } from "@/providers/UserProvder";

export type FileMeta = {
  id: string;
  file_name: string;
  storage_key: string;
  mime_type?: string | null;
  is_directory?: boolean;
};

type FilePropertiesPanelProps = {
  open: boolean;
  file: FileMeta | null;
  onClose: () => void;
  base?: string; // e.g., files/{owner}/{artist}/
};

export default function FilePropertiesPanel({
  open,
  file,
  onClose,
  base,
}: FilePropertiesPanelProps) {
  const { userData } = useUserProvider();
  const isDirectory = Boolean(file?.is_directory);
  const extension =
    !isDirectory && file?.file_name.includes(".")
      ? file?.file_name.split(".").pop()
      : undefined;

  const friendlyPath = useMemo(() => {
    if (!file) return "";
    const raw = file.storage_key;
    const rel = base && raw.startsWith(base) ? raw.slice(base.length) : raw;
    const normalized = isDirectory && !rel.endsWith("/") ? rel + "/" : rel;
    return `Home/${normalized}`;
  }, [file, base, isDirectory]);

  return (
    <div
      className={cn(
        "transition-all duration-300 h-full overflow-hidden",
        open ? "w-80" : "w-0 overflow-hidden"
      )}
    >
      <div className="p-4 h-full flex flex-col gap-4 w-80 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Properties</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
            aria-label="Close properties"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {file ? (
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Name</div>
              <div className="font-medium break-words">{file.file_name}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1 text-xs text-muted-foreground">
                Type
              </div>
              <div className="col-span-2">
                {isDirectory ? "Folder" : file.mime_type || "File"}
              </div>
              {!isDirectory && (
                <>
                  <div className="col-span-1 text-xs text-muted-foreground">
                    Extension
                  </div>
                  <div className="col-span-2">{extension || "—"}</div>
                </>
              )}
              <div className="col-span-1 text-xs text-muted-foreground">
                Path
              </div>
              <div className="col-span-2 break-all">{friendlyPath}</div>
            </div>
            {!isDirectory && (
              <ArtistAccessSelector fileId={file.id} grantedBy={userData.id} />
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No file selected.</div>
        )}
      </div>
    </div>
  );
}
