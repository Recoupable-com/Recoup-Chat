"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

interface ArtistCatalogFilterContextValue {
  currentArtistName: string | undefined;
  clearArtistFilter: () => void;
  setArtistFilter: (name: string) => void;
  setClearHandler: (fn: () => void) => void;
  setSetHandler: (fn: (name: string) => void) => void;
  setExternalCurrentName: (name: string | undefined) => void;
}

const ArtistCatalogFilterContext =
  createContext<ArtistCatalogFilterContextValue>({
    currentArtistName: undefined,
    clearArtistFilter: () => {},
    setArtistFilter: () => {},
    setClearHandler: () => {},
    setSetHandler: () => {},
    setExternalCurrentName: () => {},
  });

const ArtistCatalogFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentArtistName, setCurrentArtistName] = useState<
    string | undefined
  >(undefined);
  const clearHandlerRef = useRef<() => void>(() => {});
  const setHandlerRef = useRef<(name: string) => void>(() => {});

  const setClearHandler = useCallback((fn: () => void) => {
    clearHandlerRef.current = fn;
  }, []);

  const setSetHandler = useCallback((fn: (name: string) => void) => {
    setHandlerRef.current = fn;
  }, []);

  const clearArtistFilter = useCallback(() => {
    setCurrentArtistName(undefined);
    clearHandlerRef.current?.();
  }, []);

  const setArtistFilter = useCallback((name: string) => {
    setCurrentArtistName(name);
    setHandlerRef.current?.(name);
  }, []);

  const setExternalCurrentName = useCallback((name: string | undefined) => {
    setCurrentArtistName(name);
  }, []);

  return (
    <ArtistCatalogFilterContext.Provider
      value={{
        currentArtistName,
        clearArtistFilter,
        setArtistFilter,
        setClearHandler,
        setSetHandler,
        setExternalCurrentName,
      }}
    >
      {children}
    </ArtistCatalogFilterContext.Provider>
  );
};

const useArtistCatalogFilter = () => {
  return useContext(ArtistCatalogFilterContext);
};

export { ArtistCatalogFilterProvider, useArtistCatalogFilter };
