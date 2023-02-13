import { createContext } from "react";

interface DispositifContext {
  mode: "view" | "edit" | "translate";
  activeSection?: string;
}
const PageContext = createContext<DispositifContext>({ mode: "view" });

export default PageContext;
