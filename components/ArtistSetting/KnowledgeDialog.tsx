"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import isImagePath from "@/utils/isImagePath";
import isTextPath from "@/utils/isTextPath";
import { useTextFileContent } from "@/hooks/useTextFileContent";
import { Textarea } from "@/components/ui/textarea";
import getMimeFromPath from "@/utils/getMimeFromPath";
import { uploadFile } from "@/lib/arweave/uploadToArweave";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const { knowledgeUploading, setKnowledgeUploading, bases, setBases, saveSetting, selectedArtist } = useArtistProvider();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isEditing) setEditedText(textContent);
  }, [isEditing, textContent]);
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (isText && isEditing && editedText !== textContent) {
        const shouldClose = window.confirm("You have unsaved edits. Discard changes?");
        if (!shouldClose) return; // keep dialog open
      }
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[96vw] sm:w-[92vw] max-w-5xl pt-3 z-[1000] max-h-[90vh] overflow-hidden grid grid-rows-[auto,1fr]">
        <div className="flex flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-3 border-b px-3 py-2 sm:px-4 sm:py-3 bg-background/80 backdrop-blur">
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
          <div className="ml-0 sm:ml-4 shrink-0 flex items-center gap-2 w-full sm:w-auto justify-end">
            {isText && !isEditing && (
              <Button size="sm" variant="outline" className="h-8 px-2 text-xs sm:px-3" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
            {isText && isEditing && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-2 text-xs sm:px-3"
                  onClick={() => {
                    setEditedText(textContent);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-2 text-xs sm:px-3"
                  disabled={loading || knowledgeUploading}
                  onClick={async () => {
                    const mime = getMimeFromPath(name || url);
                    if (mime === "application/json") {
                      try {
                        JSON.parse(editedText);
                      } catch {
                        toast.warn("Invalid JSON; saving as-is");
                      }
                    }
                    try {
                      setKnowledgeUploading(true);
                      const file = new File([editedText], name || "file.txt", { type: mime });
                      const { uri } = await uploadFile(file);
                      const next = bases.map((b) => ({ ...b }));
                      const idx = next.findIndex((b) => b.url === url && b.name === name);
                      if (idx >= 0) {
                        next[idx] = { name, url: uri, type: mime } as { name: string; url: string; type: string };
                        setBases(next);
                      }
                      try {
                        await saveSetting(next);
                        const artistId = selectedArtist?.account_id;
                        if (artistId) {
                          await queryClient.invalidateQueries({ queryKey: ["artist-knowledge", artistId] });
                          await queryClient.invalidateQueries({ queryKey: ["artist-knowledge-text"] });
                        }
                        toast.success("Saved");
                        setIsEditing(false);
                      } catch {
                        toast.error("Failed to save changes");
                      }
                    } catch {
                      // swallow error; could add toast later
                      toast.error("Upload failed");
                    } finally {
                      setKnowledgeUploading(false);
                    }
                  }}
                >
                  Save
                </Button>
              </>
            )}
            <Button asChild size="sm" variant="secondary" className="h-8 px-2 text-xs sm:px-3">
              <a href={url} target="_blank" rel="noopener noreferrer">
                Open in new tab
              </a>
            </Button>
          </div>
        </div>
        {isImage ? (
          <div className="min-h-0 h-full overflow-auto bg-muted flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={name || "image"}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : isText ? (
          <div className="min-h-0 h-full overflow-auto bg-background">
            <div className="h-full overflow-auto p-3 sm:p-4">
              {isEditing ? (
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full h-[55vh] sm:h-[60vh] lg:h-[65vh] text-xs sm:text-sm font-mono resize-none"
                />
              ) : loading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : (
                <pre className="whitespace-pre-wrap break-words font-mono text-xs sm:text-sm leading-relaxed overflow-auto min-w-0">
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


