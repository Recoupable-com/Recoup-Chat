"use client";

import { isTextFile as checkIsTextFile } from "@/utils/isTextFile";
import TextFileEditor from "@/components/shared/TextFileEditor";

type FileInfoDialogContentProps = {
  isEditing: boolean;
  fileName: string;
  content: string;
  editedContent: string;
  onContentChange: (value: string) => void;
  loading: boolean;
  error: string | null;
};

export default function FileInfoDialogContent({ 
  isEditing, 
  fileName,
  content,
  editedContent,
  onContentChange,
  loading,
  error
}: FileInfoDialogContentProps) {
  const isTextFile = checkIsTextFile(fileName);

  return (
    <div className="flex-1 p-4 sm:p-6 bg-muted/20 flex flex-col">
      {!isTextFile ? (
        <div className="flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Preview not available for this file type</p>
        </div>
      ) : (
        <TextFileEditor
          content={isEditing ? editedContent : content}
          onChange={onContentChange}
          isEditing={isEditing}
          loading={loading}
          error={error}
          showStats={true}
        />
      )}
    </div>
  );
}

