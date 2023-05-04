import { createContext } from "react";

export type Modals = "Availability" | "Conditions" | "Location" | "Price" | "Public" | "Themes" | "Abstract" | "MainSponsor";

interface DispositifContext {
  mode: "view" | "edit" | "translate";
  activeSection?: string;
  setActiveSection?: (key: string) => void;
  activeModal?: Modals | null;
  setActiveModal?: (key: Modals | null) => void;
  showMissingSteps?: boolean;
  setShowMissingSteps?: (key: boolean) => void;
}
const PageContext = createContext<DispositifContext>({ mode: "view" });

export default PageContext;
