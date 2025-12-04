"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

interface OrganizationContextType {
  selectedOrgId: string | null;
  setSelectedOrgId: (orgId: string | null) => void;
  isOrgSettingsOpen: boolean;
  openOrgSettings: (orgId: string) => void;
  closeOrgSettings: () => void;
  editingOrgId: string | null;
  isCreateOrgOpen: boolean;
  openCreateOrg: () => void;
  closeCreateOrg: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

const STORAGE_KEY = "selectedOrgId";

const OrganizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedOrgId, setSelectedOrgIdState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOrgSettingsOpen, setIsOrgSettingsOpen] = useState(false);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);

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

  const openOrgSettings = useCallback((orgId: string) => {
    setEditingOrgId(orgId);
    setIsOrgSettingsOpen(true);
  }, []);

  const closeOrgSettings = useCallback(() => {
    setIsOrgSettingsOpen(false);
    setEditingOrgId(null);
  }, []);

  const openCreateOrg = useCallback(() => {
    setIsCreateOrgOpen(true);
  }, []);

  const closeCreateOrg = useCallback(() => {
    setIsCreateOrgOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      selectedOrgId: isInitialized ? selectedOrgId : null,
      setSelectedOrgId,
      isOrgSettingsOpen,
      openOrgSettings,
      closeOrgSettings,
      editingOrgId,
      isCreateOrgOpen,
      openCreateOrg,
      closeCreateOrg,
    }),
    [selectedOrgId, setSelectedOrgId, isInitialized, isOrgSettingsOpen, openOrgSettings, closeOrgSettings, editingOrgId, isCreateOrgOpen, openCreateOrg, closeCreateOrg]
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

