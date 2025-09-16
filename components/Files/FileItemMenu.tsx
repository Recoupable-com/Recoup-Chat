"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Info, Trash2 } from "lucide-react";
import DownloadMenuItem from "./DownloadMenuItem";
import { useCallback } from "react";

export type FileItemMenuProps = {
  id: string;
  fileName: string;
  storageKey: string;
  isDirectory?: boolean;
  isShared?: boolean;
  isOwner?: boolean;
  onAction?: (action: string, payload: { id: string; storageKey: string }) => void;
  onOpen?: () => void; // optional: for parent to stop propagation
};

export default function FileItemMenu({ id, fileName, storageKey, isDirectory, isShared, isOwner, onAction, onOpen }: FileItemMenuProps) {
  const handle = useCallback(
    (action: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onAction?.(action, { id, storageKey });
    },
    [onAction, id, storageKey]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpen?.();
          }}
          aria-label={`Actions for ${fileName}`}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel className="max-w-[200px] truncate">{fileName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handle("properties")}> 
          <Info className="mr-2 h-4 w-4" /> Properties
        </DropdownMenuItem>
        {!isDirectory && (isOwner || isShared) && (
          <DownloadMenuItem storageKey={storageKey} fileName={fileName} />
        )}
        <DropdownMenuSeparator />
        {!isDirectory && (!isShared || isOwner) && (
          <DropdownMenuItem onClick={handle("delete")} className="text-red-600 focus:text-red-700">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


