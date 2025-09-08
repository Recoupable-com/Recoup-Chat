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
import isTextPath from "@/utils/isTextPath";
import { useTextFileContent } from "@/hooks/useTextFileContent";

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
  const isText = isTextPath(url) || (name ? isTextPath(name) : false);
  const { content: textContent, loading, error } = useTextFileContent(
    isText ? url : null
  );
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[96vw] sm:w-[92vw] max-w-5xl pt-4 z-[1000] max-h-[90vh] overflow-hidden grid grid-rows-[auto,1fr]">
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
          <div className="min-h-0 overflow-auto bg-muted flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={name || "image"}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : isText ? (
          <div className="min-h-0 overflow-auto bg-background">
            <div className="p-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : (
                <pre className="whitespace-pre-wrap break-words font-mono text-xs sm:text-sm leading-relaxed overflow-auto">
                  {textContent}
                </pre>
              )}
            </div>
          </div>
        ) : (
          <div className="min-h-0 overflow-auto flex items-center justify-center text-xs sm:text-sm text-muted-foreground px-4 py-6 sm:p-8">
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


