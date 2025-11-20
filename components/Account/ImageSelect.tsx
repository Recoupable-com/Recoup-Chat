import ImageWithFallback from "../ImageWithFallback";
import { useUserProvider } from "@/providers/UserProvder";
import { Camera, Loader2, Trash2, Upload } from "lucide-react";
import { useMemo } from "react";

const ImageSelect = () => {
  const { imageUploading, imageRef, image, handleImageSelected, name, removeImage } =
    useUserProvider();
  
  const hasImage = image && image !== "";
  
  // Generate initials from name
  const initials = useMemo(() => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [name]);

  return (
    <>
      <div className="group relative inline-block">
        <button
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          type="button"
          onClick={() => imageRef.current?.click()}
        >
          <div className="size-32 rounded-full relative overflow-hidden flex items-center justify-center ring-1 ring-border bg-muted text-muted-foreground transition-all hover:ring-ring/50">
            {imageUploading ? (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : hasImage ? (
              <>
                <ImageWithFallback src={image} className="object-cover size-full" />
                {/* Hover Overlay - Upload */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                  <Camera className="size-8 text-white/90" />
                </div>
              </>
            ) : (
              <>
                {/* Initials Fallback */}
                <span className="text-3xl font-medium select-none">
                  {initials}
                </span>
                {/* Hover Overlay for Empty State */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                   <Upload className="size-6 text-muted-foreground" />
                </div>
              </>
            )}
          </div>
        </button>
        
        {/* Edit Badge (Bottom Right) */}
        {!imageUploading && (
          <div 
            className="absolute bottom-0 right-0 bg-background rounded-full p-1.5 shadow-sm border border-border pointer-events-none"
          >
             <Camera className="size-4 text-muted-foreground" />
          </div>
        )}

        {/* Remove Button (Top Right) - Only if image exists and on hover */}
        {hasImage && !imageUploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering upload
              removeImage();
            }}
            className="absolute -top-1 -right-1 bg-background rounded-full p-1.5 shadow-md border border-border text-destructive hover:bg-destructive/10 hover:text-destructive transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 z-30"
            title="Remove photo"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
      <input type="file" hidden ref={imageRef} onChange={handleImageSelected} accept="image/*" />
    </>
  );
};

export default ImageSelect;