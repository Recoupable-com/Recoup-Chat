import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const SegmentsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="pb-2 p-4">
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SegmentsSkeleton;
