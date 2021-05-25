import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import Logo from "../theme/images/logo.svg";
import { SmallButton } from "./SmallButton";
import { SafeAreaView } from "react-native-safe-area-context";

const MainContainer = styled.View`
  padding-horizontal: ${theme.margin * 2}px;
  padding-vertical: ${theme.margin}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const LOGO_WIDTH = 70;
const LOGO_HEIGHT = 48;

export const Header = () => (
  <SafeAreaView>
    <MainContainer>
      <Logo width={LOGO_WIDTH} height={LOGO_HEIGHT} />
      <SmallButton />
    </MainContainer>
  </SafeAreaView>
);
