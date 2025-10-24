"use client";

import { useRouter } from "next/navigation";
import { Tables } from "@/types/database.types";
import useCatalogSongs from "@/hooks/useCatalogSongs";
import { Skeleton } from "@/components/ui/skeleton";

type Catalog = Tables<"catalogs">;

interface CatalogCardProps {
  catalog: Catalog;
}

const CatalogCard = ({ catalog }: CatalogCardProps) => {
  const router = useRouter();
  const { data, isLoading } = useCatalogSongs(catalog.id);

  const songCount = data?.pagination.total_count ?? 0;

  const handleCatalogClick = () => {
    router.push(`/catalog/${catalog.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleCatalogClick}
      className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <h2 className="font-semibold text-base">{catalog.name}</h2>
      <p className="text-sm text-gray-600 mt-1">
        {isLoading ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <>
            {songCount} {songCount === 1 ? "song" : "songs"}
          </>
        )}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Created: {new Date(catalog.created_at).toLocaleDateString()}
      </p>
    </button>
  );
};

export default CatalogCard;
