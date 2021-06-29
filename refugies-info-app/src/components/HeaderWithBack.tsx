import * as React from "react";
import { SmallButton } from "./SmallButton";
import { RowContainer, RTLView } from "./BasicComponents";
import styled from "styled-components/native";
import { theme } from "../theme";
import { StyledTextSmallBold } from "./StyledText";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";

const TopButtonsContainer = styled(RowContainer)`
  justify-content: space-between;
  padding-horizontal: ${theme.margin * 3}px;
  z-index: 2;
  padding-top: ${theme.margin}px;
`;

const StyledText = styled(StyledTextSmallBold)`
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? theme.margin : 0}px;
`;

const ICON_SIZE = 24;

interface Props {
  iconName?: string;
  text?: string;
  navigation: any;
}

export const HeaderWithBack = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();

  return (
    <TopButtonsContainer>
      <SmallButton
        iconName="arrow-back-outline"
        onPress={props.navigation.goBack}
      />
      {props.iconName && props.text && (
        <RTLView>
          <Icon
            name={props.iconName}
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={theme.colors.black}
          />
          <StyledText isRTL={isRTL}>{props.text}</StyledText>
        </RTLView>
      )}
      <SmallButton iconName="volume-up-outline" />
    </TopButtonsContainer>
  );
};
