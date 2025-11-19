/**
 * Loading skeleton for Google Images search
 * Shows before/during initial API call
 */
export function GoogleImagesSkeleton() {
  return (
    <div className="space-y-3 max-w-4xl">
      <div className="h-4 w-48 bg-muted animate-pulse rounded" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="aspect-square bg-muted animate-pulse rounded-lg" 
          />
        ))}
      </div>
    </div>
  );
}




