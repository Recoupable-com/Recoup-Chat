const TaskSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 bg-muted 30 border-border">
      {/* Action Header Skeleton */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {/* Title skeleton */}
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
            {/* Status badge skeleton */}
            <div className="h-5 bg-muted rounded-full w-16 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Action Prompt Skeleton */}
      <div className="mb-3">
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full animate-pulse"></div>
          <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
        </div>
      </div>

      {/* Schedule Information Skeleton */}
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <div className="h-3.5 w-3.5 bg-blue-200 rounded animate-pulse mt-0.5"></div>
          <div className="min-w-0 flex-1">
            <div className="h-3 bg-muted rounded w-20 animate-pulse mb-1"></div>
            <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="h-3.5 w-3.5 bg-orange-200 rounded animate-pulse"></div>
          <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
          <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Last Run Skeleton */}
      <div className="mt-2 pt-2 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
          <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskSkeleton;
