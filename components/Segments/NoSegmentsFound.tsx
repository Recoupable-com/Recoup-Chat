import React from "react";
import { Button } from "@/components/ui/button";
import { SpinnerIcon } from "@/components/VercelChat/icons";
import { useCreateSegments } from "@/hooks/useCreateSegments";

interface NoSegmentsFoundProps {
  refetch?: () => void;
}

const NoSegmentsFound = ({ refetch }: NoSegmentsFoundProps) => {
  const { loading, createSegments } = useCreateSegments();

  return (
    <div className="text-lg text-center py-8 flex flex-col items-center gap-4">
      <div>No segments found for this artist.</div>
      <Button
        onClick={() => createSegments(undefined, refetch)}
        disabled={loading}
      >
        {loading && (
          <div className="inline-block animate-spin">
            <SpinnerIcon />
          </div>
        )}
        Generate Segments
      </Button>

      <ul className="mb-4 text-left w-full max-w-xs">
        {[
          "Missing IG",
          "Missing posts",
          "Missing post comments",
          "Missing fans",
          "Missing segments",
        ].map((item) => (
          <li
            key={item}
            className="flex items-center space-x-3 p-2 rounded bg-gray-50 border border-gray-200 my-1 text-gray-800"
          >
            <span className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0 border border-gray-300">
              {/* Empty status indicator, similar to GenericSuccess but no checkmark */}
            </span>
            <span className="font-medium text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoSegmentsFound;
