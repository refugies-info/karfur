import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import Logo from "../theme/images/logo.svg";
import { SmallButton } from "./SmallButton";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../services/i18n";
import { RTLView } from "./BasicComponents";
import { LanguageSwitch } from "./Language/LanguageSwitch";

const MainContainer = styled(RTLView)`
  padding-left: ${(props: { isRTL: any }) =>
    props.isRTL ? theme.margin : theme.margin * 2}px;
  padding-right: ${(props: { isRTL: any }) =>
    props.isRTL ? theme.margin * 2 : theme.margin}px;

  padding-vertical: ${theme.margin}px;
  align-items: center;
  justify-content: space-between;
  display: flex;
`;

const LOGO_WIDTH = 70;
const LOGO_HEIGHT = 48;

interface Props {
  selectedLanguageI18nCode: string | null;
  currentLanguageI18nCode: string | null;
}
export const Header = ({
  selectedLanguageI18nCode,
  currentLanguageI18nCode,
}: Props) => (
  <SafeAreaView>
    <MainContainer isRTL={i18n.isRTL()}>
      <Logo width={LOGO_WIDTH} height={LOGO_HEIGHT} />
      <RTLView>
        <LanguageSwitch
          currentLanguageI18nCode={currentLanguageI18nCode}
          selectedLanguageI18nCode={selectedLanguageI18nCode}
        />
        <SmallButton />
      </RTLView>
    </MainContainer>
  </SafeAreaView>
);
