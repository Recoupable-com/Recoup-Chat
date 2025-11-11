const FansSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-7 bg-muted rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-4">
          {Array.from({ length: 15 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square rounded-full bg-muted"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-7 bg-muted rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="p-4 border border-border rounded-lg animate-pulse"
            >
              <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FansSkeleton;
