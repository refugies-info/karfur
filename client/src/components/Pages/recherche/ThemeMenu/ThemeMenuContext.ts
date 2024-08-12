import { Id } from "@refugies-info/api-types";
import { createContext } from "react";

interface ContextProps {
  selectedThemeId: Id | undefined;
}

export const ThemeMenuContext = createContext<ContextProps>({ selectedThemeId: undefined });
