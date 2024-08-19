import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProvider as StyledComponentThemeProvider } from "styled-components/native";
import { DefaultTheme } from "styled-components/native";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { withProps } from "../../utils";
import styles from "../styles";

const ThemeProvider = withProps((props: any) => {
  const { isRTL } = useTranslationWithRTL();
  const insets = useSafeAreaInsets();

  const theme = useMemo<DefaultTheme>(
    () => ({
      ...styles,
      i18n: { isRTL },
      insets,
    }),
    [isRTL]
  );

  return { ...props, theme };
})(StyledComponentThemeProvider);

export default ThemeProvider;
