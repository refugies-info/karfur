import type React from "react";
import { createContext, type ReactNode, useContext, useState } from "react";

type DropdownContextType = {
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

interface DropdownProviderProps {
  children: ReactNode;
}

export const DropdownProvider: React.FC<DropdownProviderProps> = ({ children }) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  return (
    <DropdownContext.Provider value={{ openDropdownId, setOpenDropdownId }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdownContext must be used within a DropdownProvider");
  }
  return context;
};
