import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DefaultTheme, ThemeProvider as StyledComponentThemeProvider } from "styled-components/native";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import styles from "../styles";

const ThemeProvider: React.FC<React.PropsWithChildren<object>> = ({ children, ...props }) => {
  const { isRTL } = useTranslationWithRTL();
  const insets = useSafeAreaInsets();

  const theme = useMemo<DefaultTheme>(
    () => ({
      ...styles,
      i18n: { isRTL },
      insets,
    }),
    [isRTL],
  );
  return (
    <StyledComponentThemeProvider
      theme={theme as unknown as Parameters<typeof StyledComponentThemeProvider>[number]["theme"]}
      {...props}
    >
      {children}
    </StyledComponentThemeProvider>
  );
};

export default ThemeProvider;
