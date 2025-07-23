import { FileUIPart } from "ai";
import { PDFIcon } from "./icons";
import { FileIcon } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Link from "next/link";

const MessageFileViewer = ({ part }: { part: FileUIPart }) => {
  const isImage = part.mediaType.startsWith("image");
  const isPdf = part.mediaType === "application/pdf";
  const isDefault = !isImage && !isPdf;
  return (
    <div className="max-w-[17rem] flex gap-2 flex-wrap justify-end ml-auto">
      <PhotoProvider>
        {isImage && (
          <div
            key={part.url}
            className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border"
          >
            <PhotoView key={part.url} src={part.url}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={part.url}
                alt={part.filename}
                className="w-full h-full object-cover cursor-pointer"
              />
            </PhotoView>
          </div>
        )}
        {isPdf && (
          <Link key={part.url} href={part.url} target="_blank" passHref>
            <div className="w-16 h-16 rounded-xl">
              <PDFIcon />
            </div>
          </Link>
        )}

        {isDefault && <FileIcon key={part.url} />}
      </PhotoProvider>
    </div>
  );
};

export default MessageFileViewer;
