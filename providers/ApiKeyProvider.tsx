import { createContext, useMemo, useContext } from "react";
import useApiKey from "@/hooks/useApiKey";

const ApiKeyContext = createContext<ReturnType<typeof useApiKey>>(
  {} as ReturnType<typeof useApiKey>
);

const ApiKeyProvider = ({ children }: { children: React.ReactNode }) => {
  const apiKeyData = useApiKey();

  const value = useMemo(
    () => ({
      ...apiKeyData,
    }),
    [apiKeyData]
  );

  return <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>;
};

export const useApiKeyProvider = () => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error("useApiKeyProvider must be used within an ApiKeyProvider");
  }
  return context;
};

export default ApiKeyProvider;

