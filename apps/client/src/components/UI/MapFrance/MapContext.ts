import { createContext } from "react";

interface MapContextType {
  selectedDepartment: string | undefined;
  setSelectedDepartment?: (department: string) => void;
}

export const MapContext = createContext<MapContextType>({ selectedDepartment: undefined });
