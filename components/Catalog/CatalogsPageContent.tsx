"use client";

import useCatalogs from "@/hooks/useCatalogs";
import CatalogCard from "./CatalogCard";
import { Skeleton } from "@/components/ui/skeleton";

const CatalogsPageContent = () => {
  const { data, isLoading, error } = useCatalogs();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-500">
        {error instanceof Error ? error.message : "Failed to load catalogs"}
      </p>
    );
  }

  const catalogs = data?.catalogs || [];

  if (!catalogs.length) {
    return <p className="text-sm text-gray-600">No catalogs found.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {catalogs.map((catalog) => (
        <CatalogCard key={catalog.id} catalog={catalog} />
      ))}
    </div>
  );
};

export default CatalogsPageContent;
