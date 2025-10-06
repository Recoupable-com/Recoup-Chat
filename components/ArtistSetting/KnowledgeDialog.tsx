"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import isImagePath from "@/utils/isImagePath";
import isTextPath from "@/utils/isTextPath";
import isTextMimeType from "@/utils/isTextMimeType";
import { useTextContent } from "@/hooks/useTextContent";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useTextEditor } from "@/hooks/useTextEditor";
import { useTextFileSave } from "@/hooks/useTextFileSave";
import TextFileEditor from "@/components/shared/TextFileEditor";

type KnowledgeDialogProps = {
  name: string;
  url: string;
  type?: string;
  children: ReactNode;
};

const KnowledgeDialog = ({ name, url, type, children }: KnowledgeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isImage = isImagePath(url) || (name ? isImagePath(name) : false) || (!!type && type.startsWith("image/"));
  const ext = (() => {
    const base = (name || url).split("?")[0];
    const part = base.includes(".") ? base.split(".").pop() : undefined;
    return (part || "file").toUpperCase();
  })();
  const isText = isTextPath(url) || (name ? isTextPath(name) : false) || isTextMimeType(type);
  const { content, loading, error } = useTextContent({ 
    url: isText ? url : null,
    fileName: name,
    forceTextFile: isText
  });
  const { bases, setBases, saveSetting } = useArtistProvider();

  // Setup save handler for Arweave
  const { handleSave: saveFile } = useTextFileSave({
    type: "arweave",
    fileName: name,
    originalUrl: url,
    onSuccess: async (newUrl: string) => {
      const updatedBases = bases.map((b) => 
        b.url === url && b.name === name 
          ? { ...b, url: newUrl }
          : b
      );
      setBases(updatedBases);
      await saveSetting(updatedBases);
    },
  });

  // Setup text editor
  const {
    isEditing,
    editedContent,
    isSaving,
    setEditedContent,
    handleEditToggle,
    handleSave,
    handleDialogClose,
  } = useTextEditor({
    content,
    isDialogOpen: isOpen,
    onSave: saveFile,
  });

  const handleOpenChange = (open: boolean) => {
    if (!open && !handleDialogClose()) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[96vw] sm:w-[92vw] max-w-5xl pt-3 z-[1000] max-h-[90vh] overflow-hidden grid grid-rows-[auto,1fr]">
        <div className="flex flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-3 border-b px-3 py-2 sm:px-4 sm:py-3 bg-background/80 backdrop-blur">
          <div className="min-w-0">
            <DialogHeader><DialogTitle className="truncate text-sm sm:text-base font-medium">{name || "File"}</DialogTitle></DialogHeader>
            <div className="mt-1"><Badge variant="secondary" className="text-[10px] sm:text-[11px]">{ext}</Badge></div>
          </div>
          <div className="ml-0 sm:ml-4 shrink-0 flex items-center gap-2 w-full sm:w-auto justify-end">
            {isText && !isEditing && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 px-2 text-xs sm:px-3" 
                onClick={() => handleEditToggle(true)}
              >
                Edit
              </Button>
            )}
            {isText && isEditing && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-2 text-xs sm:px-3"
                  onClick={() => handleEditToggle(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-2 text-xs sm:px-3"
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? "Saving..." : "Save"}
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
            <img src={url} alt={name || "image"} className="max-h-full max-w-full object-contain" />
          </div>
        ) : isText ? (
          <div className="min-h-0 h-full overflow-auto bg-background p-3 sm:p-4">
            <TextFileEditor
              content={isEditing ? editedContent : content}
              onChange={setEditedContent}
              isEditing={isEditing}
              loading={loading}
              error={error}
              showStats={true}
            />
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