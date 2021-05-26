import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import Logo from "../theme/images/logo.svg";
import { SmallButton } from "./SmallButton";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../services/i18n";

const MainContainer = styled.View`
  padding-horizontal: ${theme.margin * 2}px;
  padding-vertical: ${theme.margin}px;
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "row-reverse" : "row"};
`;

const LOGO_WIDTH = 70;
const LOGO_HEIGHT = 48;

export const Header = () => (
  <SafeAreaView>
    <MainContainer isRTL={i18n.isRTL()}>
      <Logo width={LOGO_WIDTH} height={LOGO_HEIGHT} />
      <SmallButton />
    </MainContainer>
  </SafeAreaView>
);
