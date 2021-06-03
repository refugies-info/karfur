import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import Logo from "../theme/images/logo.svg";
import { SmallButton } from "./SmallButton";
import { SafeAreaView } from "react-native-safe-area-context";
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
  onLongPressSwitchLanguage?: () => void;
}
export const Header = ({ onLongPressSwitchLanguage }: Props) => (
  <SafeAreaView>
    <MainContainer isRTL={false}>
      <Logo width={LOGO_WIDTH} height={LOGO_HEIGHT} />
      <RowContainer>
        <LanguageSwitch onLongPressSwitchLanguage={onLongPressSwitchLanguage} />
        <SmallButton />
      </RowContainer>
    </MainContainer>
  </SafeAreaView>
);
