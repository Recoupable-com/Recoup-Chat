"use client";

import { ImageIcon } from "lucide-react";
import { PhotoView } from "react-photo-view";

type FileTileImageProps = {
  signedUrl: string;
  fileName: string;
};

export default function FileTileImage({ signedUrl, fileName }: FileTileImageProps) {
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const placeholder = img.previousElementSibling as HTMLElement;
    if (placeholder) {
      placeholder.style.display = 'none';
    }
  };

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full rounded-lg absolute inset-0 z-0 flex items-center justify-center">
        <ImageIcon className="w-8 h-8 text-muted-foreground" />
      </div>
      <PhotoView src={signedUrl}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={signedUrl}
          alt={fileName}
          loading="lazy"
          className="h-full w-full object-cover rounded-lg absolute inset-0 z-10"
          onLoad={handleImageLoad}
        />
      </PhotoView>
    </div>
  );
}

