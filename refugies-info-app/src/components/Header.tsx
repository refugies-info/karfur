import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import Logo from "../theme/images/logo.svg";
import { SmallButton } from "./SmallButton";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../services/i18n";
import { RTLView } from "./StyledText";
import { RowContainer } from "./BasicComponents";
import { LanguageSwitch } from "./Language/LanguageSwitch";

const MainContainer = styled(RTLView)`
  padding-horizontal: ${theme.margin * 2}px;
  padding-vertical: ${theme.margin}px;
  align-items: center;
  justify-content: space-between;
  display: flex;
`;

const LOGO_WIDTH = 70;
const LOGO_HEIGHT = 48;

export const Header = () => (
  <SafeAreaView>
    <MainContainer isRTL={i18n.isRTL()}>
      <Logo width={LOGO_WIDTH} height={LOGO_HEIGHT} />
      <RowContainer>
        <LanguageSwitch />
        <SmallButton />
      </RowContainer>
    </MainContainer>
  </SafeAreaView>
);
