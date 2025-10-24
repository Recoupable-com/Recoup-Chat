"use client";

import { useRouter } from "next/navigation";
import { Tables } from "@/types/database.types";
import useCatalogSongs from "@/hooks/useCatalogSongs";

type Catalog = Tables<"catalogs">;

interface CatalogCardProps {
  catalog: Catalog;
}

const CatalogCard = ({ catalog }: CatalogCardProps) => {
  const router = useRouter();
  const { data, isLoading } = useCatalogSongs(catalog.id);

  const songCount = data?.pagination.total_count ?? 0;

  const handleCatalogClick = (catalogId: string) => {
    router.push(`/catalog/${catalogId}`);
  };

  return (
    <div
      onClick={() => handleCatalogClick(catalog.id)}
      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <h2 className="font-semibold text-base">{catalog.name}</h2>
      <p className="text-sm text-gray-600 mt-1">
        {isLoading ? (
          "Loading songs..."
        ) : (
          <>
            {songCount} {songCount === 1 ? "song" : "songs"}
          </>
        )}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Created: {new Date(catalog.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export default CatalogCard;
