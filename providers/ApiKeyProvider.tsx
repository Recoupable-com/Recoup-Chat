import { createContext, useContext } from "react";
import useApiKey from "@/hooks/useApiKey";

const ApiKeyContext = createContext<ReturnType<typeof useApiKey> | null>(null);

const ApiKeyProvider = ({ children }: { children: React.ReactNode }) => {
  const apiKeyData = useApiKey();

  return (
    <ApiKeyContext.Provider value={apiKeyData}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeyProvider = () => {
  const context = useContext(ApiKeyContext);
  if (context === null) {
    throw new Error("useApiKeyProvider must be used within an ApiKeyProvider");
  }
  return context;
};

export default ApiKeyProvider;
