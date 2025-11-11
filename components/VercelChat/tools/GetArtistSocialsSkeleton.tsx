import { Loader } from "lucide-react";

const GetArtistSocialsSkeleton = ({ title }: { title?: string }) => {
  return (
    <div className="flex flex-col gap-4 p-4 border dark:border-dark-border rounded-lg animate-pulse dark:bg-dark-bg-primary">
      <div className="flex items-center gap-2">
        <Loader className="h-5 w-5 animate-spin text-primary dark:text-white" />
        <h3 className="font-medium text-sm md:text-base dark:text-white">
          {title ?? "Getting Artist Socials..."}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-medium dark:text-white">Artist Socials</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-3 border dark:border-dark-border rounded-lg"
            >
              <div className="w-12 h-12 mb-2 bg-gray-200 dark:bg-dark-bg-tertiary rounded-md"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-dark-bg-tertiary rounded mb-1"></div>
              <div className="h-3 w-12 bg-gray-200 dark:bg-dark-bg-tertiary rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetArtistSocialsSkeleton;
