import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import Logo from "../theme/images/logo.svg";
import { SmallButton } from "./SmallButton";
import { RowContainer } from "./BasicComponents";
import { LanguageSwitch } from "./Language/LanguageSwitch";
import { FixSafeAreaView } from "./FixSafeAreaView";
import { View } from "react-native";

const MainContainer = styled(RowContainer)`
  padding-horizontal: ${theme.margin * 3}px;
  align-items: center;
  justify-content: space-between;
  display: flex;
  padding-top: ${theme.margin}px;
`;

const LOGO_WIDTH = 58;
const LOGO_HEIGHT = 40;

interface Props {
  onLongPressSwitchLanguage?: () => void;
  hideLanguageSwitch?: boolean;
  hideLogo?: boolean;
}
export const HeaderWithLogo = ({
  onLongPressSwitchLanguage,
  hideLanguageSwitch,
  hideLogo,
}: Props) => (
  <FixSafeAreaView>
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
  </FixSafeAreaView>
);

interface PropsBack {
  onLongPressSwitchLanguage?: () => void;
  navigation: any;
}
export const HeaderWithBackForWrapper = ({
  onLongPressSwitchLanguage,
  navigation,
}: PropsBack) => {
  return (
    <FixSafeAreaView>
      <MainContainer isRTL={false}>
        <SmallButton
          iconName="arrow-back-outline"
          onPress={navigation.goBack}
        />
        <RowContainer>
          <LanguageSwitch
            onLongPressSwitchLanguage={onLongPressSwitchLanguage}
          />

          <SmallButton iconName="volume-up-outline" />
        </RowContainer>
      </MainContainer>
    </FixSafeAreaView>
  );
};
