import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ClientContextType {
  clientNumber: string | null;
  setClientNumber: (value: string) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clientNumber, setClientNumber] = useState<string | null>(null);

  useEffect(() => {
    const savedClient = localStorage.getItem("clientNumber");
    console.log("[Context] Carregando clientNumber do localStorage:", savedClient);
    if (savedClient) {
      setClientNumber(savedClient);
    }
  }, []);

  const handleSetClientNumber = (value: string) => {
    localStorage.setItem("clientNumber", value);
    setClientNumber(value);
  };

  return (
    <ClientContext.Provider value={{ clientNumber, setClientNumber: handleSetClientNumber }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) throw new Error("useClient must be used within a ClientProvider");
  return context;
};

