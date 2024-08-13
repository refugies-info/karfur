import { Id } from "@refugies-info/api-types";
import { createContext } from "react";

interface ContextProps {
  search: string;
  selectedThemeId: Id | undefined;
  setSelectedThemeId: (id: Id) => void;
}

export const ThemeMenuContext = createContext<ContextProps>({
  search: "",
  selectedThemeId: undefined,
  setSelectedThemeId: () => {},
});
