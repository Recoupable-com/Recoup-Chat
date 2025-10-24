interface CatalogSongsInfiniteScrollTriggerProps {
  observerTarget: React.RefObject<HTMLDivElement>;
  isFetchingNextPage: boolean;
}

const CatalogSongsInfiniteScrollTrigger = ({
  observerTarget,
  isFetchingNextPage,
}: CatalogSongsInfiniteScrollTriggerProps) => {
  return (
    <div ref={observerTarget} className="h-20 flex items-center justify-center">
      {isFetchingNextPage && (
        <p className="text-sm text-gray-500">Loading more songs...</p>
      )}
    </div>
  );
};

export default CatalogSongsInfiniteScrollTrigger;
