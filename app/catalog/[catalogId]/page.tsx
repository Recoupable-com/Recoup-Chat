import CatalogSongsPage from "@/components/Catalog/CatalogSongsPage";

interface CatalogPageProps {
  params: {
    catalogId: string;
  };
}

const CatalogPage = ({ params }: CatalogPageProps) => {
  return <CatalogSongsPage catalogId={params.catalogId} />;
};

export default CatalogPage;

