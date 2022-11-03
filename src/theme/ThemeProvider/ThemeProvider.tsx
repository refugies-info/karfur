import { useMemo } from "react";
import { ThemeProvider as StyledComponentThemeProvider } from "styled-components/native";
import { DefaultTheme } from "styled-components/native";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { withProps } from "../../utils";
import { styles } from "../index";

const ThemeProvider = withProps((props: any) => {
  const { isRTL } = useTranslationWithRTL();

  const theme = useMemo<DefaultTheme>(
    () => ({
      ...styles,
      i18n: { isRTL },
    }),
    [isRTL]
  );

  return { ...props, theme };
})(StyledComponentThemeProvider);

export default ThemeProvider;
