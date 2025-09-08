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
      <DialogContent className="w-[92vw] max-w-5xl pt-4 z-[1000] overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3 bg-background/80 backdrop-blur">
          <div className="min-w-0">
            <DialogHeader>
              <DialogTitle className="truncate text-base font-medium">
                {name || "File"}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-1">
              <Badge variant="secondary" className="text-[10px]">{ext}</Badge>
            </div>
          </div>
          <div className="ml-4 shrink-0">
            <Button asChild size="sm" variant="secondary">
              <a href={url} target="_blank" rel="noopener noreferrer">
                Open in new tab
              </a>
            </Button>
          </div>
        </div>
        {isImage ? (
          <div className="h-[70vh] bg-muted flex items-center justify-center select-none pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={name || "image"}
              className="max-h-[65vh] max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="h-[70vh] flex items-center justify-center text-sm text-muted-foreground p-8">
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


