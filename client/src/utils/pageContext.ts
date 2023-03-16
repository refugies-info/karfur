import { createContext } from "react";

interface DispositifContext {
  mode: "view" | "edit" | "translate";
  activeSection?: string;
  setActiveSection?: (key: string) => void;
}
const PageContext = createContext<DispositifContext>({ mode: "view" });

export default PageContext;
