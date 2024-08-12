import { Id } from "@refugies-info/api-types";
import { createContext } from "react";

interface ContextProps {
  selectedThemeId: Id | undefined;
  setSelectedThemeId: (id: Id) => void;
}

export const ThemeMenuContext = createContext<ContextProps>({
  selectedThemeId: undefined,
  setSelectedThemeId: () => {},
});
