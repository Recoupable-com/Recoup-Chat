import { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

const ImageWithFallback = ({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) => {
  const [imgError, setImgError] = useState(false);
  const [keyValue, setKeyValue] = useState(0);

  // Reset error state when src changes
  useEffect(() => {
    setImgError(false);
    setKeyValue((prev) => prev + 1);
  }, [src]);

  // If no src or error loading image, show placeholder
  if (!src || imgError) {
    return (
      <div className="w-full h-full min-w-8 min-h-8">
        <div className={`bg-muted w-full h-full flex items-center justify-center rounded-full border border-border ${className}`}>
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Validate URL format
  const isValidUrl = src.startsWith("http://") || src.startsWith("https://");
  if (!isValidUrl) {
    return (
      <div className="w-full h-full min-w-8 min-h-8">
        <div className={`bg-muted w-full h-full flex items-center justify-center rounded-full border border-border ${className}`}>
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Use regular img tag for all external URLs to avoid Next.js Image optimization issues in production
  // External URLs are already optimized by their CDNs and don't benefit from Next.js optimization
  const isExternalURL = src.startsWith("http://") || src.startsWith("https://");
  
  if (isExternalURL) {
    return (
      <div className="w-full h-full min-w-8 min-h-8 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={keyValue}
          src={src}
          alt="Profile avatar"
          className={`object-cover w-full h-full ${className}`}
          onError={() => {
            setImgError(true);
          }}
          onLoad={() => {}}
        />
      </div>
    );
  }

  // Fallback to Next.js Image for relative paths or data URLs (though we shouldn't hit this)
  return (
    <div className="w-full h-full min-w-8 min-h-8 relative">
      <Image
        key={keyValue}
        src={src}
        alt="Profile avatar"
        fill
        className={`object-cover ${className}`}
        onError={() => {
          setImgError(true);
        }}
        onLoad={() => {}}
        sizes="128px"
      />
    </div>
  );
};

export default ImageWithFallback;