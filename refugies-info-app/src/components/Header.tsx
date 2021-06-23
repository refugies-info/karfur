import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import Logo from "../theme/images/logo.svg";
import { SmallButton } from "./SmallButton";
import { RowContainer } from "./BasicComponents";
import { LanguageSwitch } from "./Language/LanguageSwitch";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MainContainer = styled(RowContainer)`
  padding-left: ${(props: { isRTL: any }) =>
    props.isRTL ? theme.margin * 3 : theme.margin * 3}px;
  padding-right: ${(props: { isRTL: any }) =>
    props.isRTL ? theme.margin * 3 : theme.margin * 3}px;

  align-items: center;
  justify-content: space-between;
  display: flex;
`;

const StyledSafeAreaView = styled(SafeAreaView)`
  z-index: 2;
`;
const LOGO_WIDTH = 58;
const LOGO_HEIGHT = 40;

interface Props {
  onLongPressSwitchLanguage?: () => void;
  hideLanguageSwitch?: boolean;
  hideLogo?: boolean;
}
export const Header = ({
  onLongPressSwitchLanguage,
  hideLanguageSwitch,
  hideLogo,
}: Props) => (
  <StyledSafeAreaView>
    <MainContainer isRTL={false}>
      {!hideLogo ? <Logo width={LOGO_WIDTH} height={LOGO_HEIGHT} /> : <View />}
      <RowContainer>
        {!hideLanguageSwitch && (
          <LanguageSwitch
            onLongPressSwitchLanguage={onLongPressSwitchLanguage}
          />
        )}
        <SmallButton iconName="volume-up-outline" />
      </RowContainer>
    </MainContainer>
  </StyledSafeAreaView>
);
