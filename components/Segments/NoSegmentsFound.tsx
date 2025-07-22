import React from "react";
import { Button } from "@/components/ui/button";
import { SpinnerIcon } from "@/components/VercelChat/icons";
import { useCreateSegments } from "@/hooks/useCreateSegments";
import { Icons } from "@/components/Icon/resolver";
import { useArtistSocials } from "@/hooks/useArtistSocials";

interface NoSegmentsFoundProps {
  refetch?: () => void;
}

const NoSegmentsFound = ({ refetch }: NoSegmentsFoundProps) => {
  const { hasInstagram } = useArtistSocials();
  const { loading, createSegments } = useCreateSegments();

  return (
    <div className="text-lg text-center py-8 flex flex-col items-center gap-4">
      <div>No fan groups found for this artist.</div>
      <Button onClick={() => createSegments(refetch)} disabled={loading}>
        {loading && (
          <div className="inline-block animate-spin">
            <SpinnerIcon />
          </div>
        )}
        Create Fan Groups
      </Button>
      <ul className="mb-4 text-left w-full max-w-xs">
        <li className="flex items-center space-x-3 p-2 rounded bg-gray-50 border border-gray-200 my-1 text-gray-800">
          {hasInstagram ? <Icons.CheckIcon /> : <Icons.UncheckedIcon />}
          <span className="font-medium text-sm">
            {hasInstagram ? "Instagram Connected" : "Missing Instagram"}
          </span>
        </li>
        {[
          "Missing posts",
          "Missing post comments",
          "Missing fans",
          "Missing segments",
        ].map((item) => (
          <li
            key={item}
            className="flex items-center space-x-3 p-2 rounded bg-gray-50 border border-gray-200 my-1 text-gray-800"
          >
            <Icons.UncheckedIcon />
            <span className="font-medium text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoSegmentsFound;
