import React from "react";
import { theme } from "../theme";
import styled from "styled-components/native";
import Logo from "../theme/images/logo.svg";
import { SmallButton } from "./SmallButton";
import { RowContainer } from "./BasicComponents";
import { LanguageSwitch } from "./Language/LanguageSwitch";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Device from "expo-device";

const MainContainer = styled(RowContainer)`
  padding-horizontal: ${theme.margin * 3}px;
  align-items: center;
  justify-content: space-between;
  display: flex;
  padding-top: ${theme.margin}px;
`;

const StyledSafeAreaView = styled(SafeAreaView)`
  z-index: 2;
  margin-bottom: ${(props: { isIPhone12: boolean }) =>
    props.isIPhone12 ? "-25" : "0"}px;
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

interface PropsBack {
  onLongPressSwitchLanguage?: () => void;
  navigation: any;
}
export const HeaderWithBackForWrapper = ({
  onLongPressSwitchLanguage,
  navigation,
}: PropsBack) => {
  // there is an issue with react-native-safe-area-context on iPhone12 height is too big. I have not found simple fix other than what is below
  const isIPhone12 = [
    "iPhone13,1",
    "iPhone13,2",
    "iPhone13,3",
    "iPhone13,4",
  ].includes(Device.modelId);
  return (
    <StyledSafeAreaView isIPhone12={isIPhone12}>
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
    </StyledSafeAreaView>
  );
};
