const ScheduledActionSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50/30 border-gray-200">
      {/* Action Header Skeleton */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {/* Title skeleton */}
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            {/* Status badge skeleton */}
            <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Action Prompt Skeleton */}
      <div className="mb-3">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>

      {/* Schedule Information Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <div className="h-3.5 w-3.5 bg-blue-200 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="h-3.5 w-3.5 bg-orange-200 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Last Run Skeleton */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledActionSkeleton;
