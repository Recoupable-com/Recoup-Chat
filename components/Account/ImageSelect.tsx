import ImageWithFallback from "../ImageWithFallback";
import { useUserProvider } from "@/providers/UserProvder";
import { Upload, Loader2, User } from "lucide-react";

const ImageSelect = () => {
  const { imageUploading, imageRef, image, handleImageSelected } =
    useUserProvider();
  
  const hasImage = image && image !== "";
  
  return (
    <>
      <button
        className="w-full group"
        type="button"
        onClick={() => imageRef.current?.click()}
      >
        <div className="w-full aspect-square max-w-[150px] rounded-xl relative overflow-hidden flex items-center justify-center border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors cursor-pointer bg-muted/20">
          {imageUploading ? (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Uploading...</p>
            </div>
          ) : hasImage ? (
            <>
              <ImageWithFallback src={image} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="size-6 text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <User className="size-12" />
              <p className="text-xs">Click to upload</p>
            </div>
          )}
        </div>
      </button>
      <input type="file" hidden ref={imageRef} onChange={handleImageSelected} accept="image/*" />
    </>
  );
};

export default ImageSelect;
