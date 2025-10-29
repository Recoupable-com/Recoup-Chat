"use client";

import useSearchIsrc from "@/hooks/useSearchIsrc";
import Search from "@/components/Search";
import CatalogSongsDisplay from "./CatalogSongsDisplay";

interface CatalogSongsPageContentProps {
  catalogId: string;
}

const CatalogSongsPageContent = ({
  catalogId,
}: CatalogSongsPageContentProps) => {
  const {
    searchIsrc,
    setSearchIsrc,
    activeIsrc,
    queryResult,
    handleSearch,
    handleClearSearch,
    isSearchMode,
  } = useSearchIsrc();

  return (
    <div>
      <Search
        value={searchIsrc}
        onChange={setSearchIsrc}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search by ISRC code (e.g., USRC17607839)"
        showClearButton={!!activeIsrc}
      />
      <CatalogSongsDisplay
        catalogId={catalogId}
        isSearchMode={isSearchMode}
        searchData={queryResult.data}
        searchLoading={queryResult.isLoading}
        searchError={queryResult.error}
        activeIsrc={activeIsrc}
      />
    </div>
  );
};

export default CatalogSongsPageContent;
