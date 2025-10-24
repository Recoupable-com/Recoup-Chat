"use client";

import { useRouter } from "next/navigation";
import { useAutoLogin } from "@/hooks/useAutoLogin";
import useCatalogs from "@/hooks/useCatalogs";
import CatalogCard from "./CatalogCard";

const Title = () => (
  <h1 className="text-lg md:text-xl font-bold pb-4">Catalogs</h1>
);

const CatalogsPage = () => {
  useAutoLogin();
  const router = useRouter();
  const { data, isLoading, error } = useCatalogs();

  const handleCatalogClick = (catalogId: string) => {
    router.push(`/catalog/${catalogId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-screen min-h-screen p-4">
        <Title />
        <p className="text-sm text-gray-600">Loading catalogs...</p>
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
          <CatalogCard
            key={catalog.id}
            catalog={catalog}
            onClick={handleCatalogClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CatalogsPage;
