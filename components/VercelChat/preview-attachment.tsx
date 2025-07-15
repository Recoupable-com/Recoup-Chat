import type { Attachment } from 'ai';
import { Loader2, FileIcon } from 'lucide-react';
import { PDFIcon } from "./icons";
import { PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div data-testid="input-attachment-preview" className="flex flex-col gap-2">
      <div className="w-16 h-16 bg-transparent rounded-xl relative flex flex-col items-center justify-center overflow-hidden">
        {contentType ? (
          <>
            {contentType.startsWith("image") && (
              <PhotoView key={url} src={url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={name ?? "An image attachment"}
                  className="rounded-md size-full object-cover cursor-pointer"
                />
              </PhotoView>
            )}
            {contentType === 'application/pdf' && (
              <div className="flex items-center justify-center bg-transparent">
                <PDFIcon />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center text-zinc-500">
            <FileIcon size={24} />
          </div>
        )}

        {isUploading && (
          <div
            data-testid="input-attachment-loader"
            className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center"
          >
            <Loader2 className="animate-spin text-white" size={20} />
          </div>
        )}
      </div>
      <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div>
    </div>
  );
};
