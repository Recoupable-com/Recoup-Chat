"use client";

import { useFileContent } from "@/hooks/useFileContent";
import FilePreview from "./FilePreview";
import FileEditor from "./FileEditor";

type FileInfoDialogContentProps = {
  isEditing: boolean;
  fileName: string;
  storageKey: string;
};

export default function FileInfoDialogContent({ 
  isEditing, 
  fileName, 
  storageKey 
}: FileInfoDialogContentProps) {
  const { content, loading, error, isTextFile } = useFileContent(fileName, storageKey);

  return (
    <div className="flex-1 p-4 sm:p-6 bg-muted/20 flex flex-col">
      {isEditing ? (
        <FileEditor />
      ) : (
        <FilePreview 
          content={content}
          loading={loading}
          error={error}
          isTextFile={isTextFile}
        />
      )}
    </div>
  );
}

