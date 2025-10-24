"use client";

import { useAutoLogin } from "@/hooks/useAutoLogin";
import useCatalogs from "@/hooks/useCatalogs";
import CatalogCard from "./CatalogCard";
import { Skeleton } from "@/components/ui/skeleton";

const Title = () => (
  <h1 className="text-lg md:text-xl font-bold pb-4">Catalogs</h1>
);

const CatalogsPage = () => {
  useAutoLogin();
  const { data, isLoading, error } = useCatalogs();

  if (isLoading) {
    return (
      <div className="max-w-screen min-h-screen p-4">
        <Title />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen min-h-screen p-4">
        <Title />
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : "Failed to load catalogs"}
        </p>
      </div>
    );
  }

  const catalogs = data?.catalogs || [];

  if (!catalogs.length) {
    return (
      <div className="max-w-screen min-h-screen p-4">
        <Title />
        <p className="text-sm text-gray-600">No catalogs found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen min-h-screen p-4">
      <Title />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {catalogs.map((catalog) => (
          <CatalogCard key={catalog.id} catalog={catalog} />
        ))}
      </div>
    </div>
  );
};

export default CatalogsPage;
