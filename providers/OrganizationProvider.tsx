"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

interface OrganizationContextType {
  selectedOrgId: string | null;
  setSelectedOrgId: (orgId: string | null) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

const STORAGE_KEY = "selectedOrgId";

const OrganizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedOrgId, setSelectedOrgIdState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSelectedOrgIdState(stored);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage when changed
  const setSelectedOrgId = useCallback((orgId: string | null) => {
    setSelectedOrgIdState(orgId);
    if (orgId) {
      localStorage.setItem(STORAGE_KEY, orgId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      selectedOrgId: isInitialized ? selectedOrgId : null,
      setSelectedOrgId,
    }),
    [selectedOrgId, setSelectedOrgId, isInitialized]
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
};

export { OrganizationProvider, useOrganization };

