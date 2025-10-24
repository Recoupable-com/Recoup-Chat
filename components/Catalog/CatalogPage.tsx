import { useAutoLogin } from "@/hooks/useAutoLogin";

const CatalogPage = () => {
  useAutoLogin();

  return (
    <div className="max-w-screen min-h-screen p-4">
      <h1 className="text-lg md:text-xl font-bold pb-4">Catalog</h1>
      <div className="text-sm text-gray-600">
        <p>View and manage your music catalogs here.</p>
      </div>
    </div>
  );
};

export default CatalogPage;
