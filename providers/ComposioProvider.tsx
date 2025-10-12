"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

/**
 * ComposioProvider
 * Provides Composio client instance configured with Vercel AI SDK provider
 * Single responsibility: Initialize and provide Composio client to the app
 */

interface ComposioContextType {
  composio: Composio<VercelProvider> | null;
}

const ComposioContext = createContext<ComposioContextType | undefined>(undefined);

const getComposioClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_COMPOSIO_API_KEY;
  
  if (!apiKey) {
    console.warn('COMPOSIO_API_KEY not found in environment variables');
    return null;
  }

  return new Composio<VercelProvider>({
    apiKey,
    provider: new VercelProvider(),
  });
};

const composioClient = getComposioClient();

export const ComposioProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ComposioContext.Provider value={{ composio: composioClient }}>
      {children}
    </ComposioContext.Provider>
  );
};

export const useComposio = () => {
  const context = useContext(ComposioContext);
  if (!context) {
    throw new Error("useComposio must be used within ComposioProvider");
  }
  return context;
};

