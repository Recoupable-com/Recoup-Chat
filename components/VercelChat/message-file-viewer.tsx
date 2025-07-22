import { Attachment } from 'ai';
import { PDFIcon } from "./icons";
import { FileIcon } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Link from "next/link";

const MessageFileViewer = ({
  experimentalAttachment,
}: {
  experimentalAttachment: Attachment[] | undefined;
}) => {
  if (!experimentalAttachment || experimentalAttachment.length === 0)
    return null;
  return (
    <div className="max-w-[17rem] flex gap-2 flex-wrap justify-end ml-auto">
      <PhotoProvider>
      {experimentalAttachment?.map((attachment) => {
        if (attachment.contentType?.startsWith("image")) {
          return (
            <div key={attachment.url} className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border">
              <PhotoView key={attachment.url} src={attachment.url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                src={attachment.url}
                alt={attachment.name}
                className="w-full h-full object-cover cursor-pointer"
              />
              </PhotoView>
            </div>
          );
        }
        if (attachment.contentType === "application/pdf") {
          return (
            <Link key={attachment.url} href={attachment.url} target="_blank" passHref>
            <div className="w-16 h-16 rounded-xl">
              <PDFIcon />
            </div>
            </Link>
          );
        }
        return <FileIcon key={attachment.url} />;
      })}
      </PhotoProvider>
    </div>
  );
};

export default MessageFileViewer;
