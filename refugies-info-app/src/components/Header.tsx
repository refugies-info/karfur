import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import Logo from "../theme/images/logo.svg";
import { SmallButton } from "./SmallButton";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../services/i18n";
import { RowContainer } from "./BasicComponents";
import { LanguageSwitch } from "./Language/LanguageSwitch";

const MainContainer = styled(RowContainer)`
  padding-left: ${(props: { isRTL: any }) =>
    props.isRTL ? theme.margin * 3 : theme.margin * 3}px;
  padding-right: ${(props: { isRTL: any }) =>
    props.isRTL ? theme.margin * 3 : theme.margin * 3}px;

  padding-vertical: ${theme.margin}px;
  align-items: center;
  justify-content: space-between;
  display: flex;
`;

const LOGO_WIDTH = 70;
const LOGO_HEIGHT = 48;

interface Props {
  selectedLanguageI18nCode?: string | null;
  currentLanguageI18nCode?: string | null;
  onLongPressSwitchLanguage?: () => void;
}
export const Header = ({
  selectedLanguageI18nCode,
  currentLanguageI18nCode,
  onLongPressSwitchLanguage,
}: Props) => (
  <SafeAreaView>
    <MainContainer isRTL={i18n.isRTL()}>
      <Logo width={LOGO_WIDTH} height={LOGO_HEIGHT} />
      <RowContainer>
        <LanguageSwitch
          currentLanguageI18nCode={currentLanguageI18nCode}
          selectedLanguageI18nCode={selectedLanguageI18nCode}
          onLongPressSwitchLanguage={onLongPressSwitchLanguage}
        />
        <SmallButton />
      </RowContainer>
    </MainContainer>
  </SafeAreaView>
);
