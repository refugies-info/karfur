import { Id } from "@refugies-info/api-types";
import { createContext } from "react";

interface ContextProps {
  nbDispositifsByNeed: Record<string, number>;
  nbDispositifsByTheme: Record<string, number>;
  search: string;
  selectedThemeId: Id | undefined;
  setSelectedThemeId: (id: Id) => void;
}

export const ThemeMenuContext = createContext<ContextProps>({
  nbDispositifsByNeed: {},
  nbDispositifsByTheme: {},
  search: "",
  selectedThemeId: undefined,
  setSelectedThemeId: () => {},
});
