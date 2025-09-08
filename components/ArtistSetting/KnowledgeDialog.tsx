"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import isImagePath from "@/utils/isImagePath";

type KnowledgeDialogProps = {
  name: string;
  url: string;
  children: ReactNode;
};

const KnowledgeDialog = ({ name, url, children }: KnowledgeDialogProps) => {
  const isImage = isImagePath(url) || (name ? isImagePath(name) : false);
  const ext = (() => {
    const base = (name || url).split("?")[0];
    const part = base.includes(".") ? base.split(".").pop() : undefined;
    return (part || "file").toUpperCase();
  })(); // Create PNG, JPG, TXT etc. label etc.
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[96vw] sm:w-[92vw] max-w-5xl pt-4 z-[1000] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b px-3 py-2 sm:px-4 sm:py-3 bg-background/80 backdrop-blur">
          <div className="min-w-0">
            <DialogHeader>
              <DialogTitle className="truncate text-sm sm:text-base font-medium">
                {name || "File"}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-1">
              <Badge variant="secondary" className="text-[10px] sm:text-[11px]">{ext}</Badge>
            </div>
          </div>
          <div className="ml-4 shrink-0">
            <Button asChild size="sm" variant="secondary" className="h-8 px-3">
              <a href={url} target="_blank" rel="noopener noreferrer">
                Open in new tab
              </a>
            </Button>
          </div>
        </div>
        {isImage ? (
          <div className="flex-1 min-h-0 bg-muted flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={name || "image"}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex items-center justify-center text-xs sm:text-sm text-muted-foreground px-4 py-6 sm:p-8">
            <div className="text-center space-y-2">
              <p className="font-medium">Preview not available</p>
              <p>Use the button above to open the file in a new tab.</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeDialog;


