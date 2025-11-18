import { useState } from "react";

interface GoogleImage {
  position: number;
  thumbnail: string;
  original: string;
  width: number;
  height: number;
  title: string;
  source: string;
  link: string;
}

export interface GoogleImagesResultType {
  success: boolean;
  query: string;
  total_results: number;
  images: GoogleImage[];
  message: string;
  error?: string;
}

export function GoogleImagesResult({ 
  result 
}: { 
  result: GoogleImagesResultType
}) {
  // Handle error state
  if (!result.success) {
    return (
      <div className="p-4 rounded-xl border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20">
        {result.error || "Failed to search Google Images"}
      </div>
    );
  }

  // Handle case where no images were found
  if (!result.images || result.images.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">
          No images found for &quot;{result.query}&quot;
        </p>
      </div>
    );
  }

  // Display images
  return (
    <div className="flex flex-col gap-3 max-w-4xl">
      <div className="text-sm text-muted-foreground">
        Found {result.total_results} images for &quot;{result.query}&quot;
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {result.images.map((image) => (
          <ImageCard key={image.position} image={image} />
        ))}
      </div>
    </div>
  );
}

function ImageCard({ image }: { image: GoogleImage }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="group/image relative overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all bg-card shadow-sm hover:shadow-md">
      <a
        href={image.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-square relative"
      >
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="text-center p-4">
              <p className="text-xs text-muted-foreground">Image unavailable</p>
            </div>
          </div>
        ) : (
          <img
            src={image.thumbnail}
            alt={image.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-110 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => {
              setIsLoading(false);
            }}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        )}
      </a>
      
      {!hasError && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
          <p className="text-xs text-white font-medium truncate">{image.title}</p>
          <p className="text-xs text-gray-300 truncate mt-0.5">{image.source}</p>
        </div>
      )}
    </div>
  );
}

