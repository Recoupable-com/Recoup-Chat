"use client";

import { ArtistCatalogFilterProvider } from "@/providers/ArtistCatalogFilterProvider";
import CatalogSongsResult, {
  CatalogSongsResult as CatalogSongsResultType,
} from "./CatalogSongsResult";

interface CatalogSongsResultWithProviderProps {
  result: CatalogSongsResultType;
}

export default function CatalogSongsResultWithProvider({
  result,
}: CatalogSongsResultWithProviderProps) {
  return (
    <ArtistCatalogFilterProvider>
      <CatalogSongsResult result={result} />
    </ArtistCatalogFilterProvider>
  );
}
