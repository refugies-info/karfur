import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { theme } from "../../theme";
import { Icon } from "react-native-eva-icons";
import { StyledTextSmallBold, StyledTextSmall } from "../StyledText";
import { View } from "react-native";

const ButtonContainer = styled(RTLTouchableOpacity)`
  align-items: center;
  height: 56px;
  padding-horizontal: ${theme.margin * 2}px;
  justify-content: space-between;
`;

const StyledCategoryText = styled(StyledTextSmallBold)`
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    !props.isRTL ? 0 : theme.margin}px;
`;

const StyledChoiceText = styled(StyledTextSmall)`
  color: ${theme.colors.darkGrey};
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : theme.margin}px;
  margin-left: ${(props: { isRTL: boolean }) =>
    !props.isRTL ? 0 : theme.margin}px;

  max-width: 110px;
  flex-shrink: 1;
`;

const Separator = styled.View`
  height: 1px;
  background-color: ${theme.colors.grey};
`;

interface Props {
  iconName: string;
  category: string;
  userChoice?: string;
  isFirst: boolean;
  isLast: boolean;
  isRTL: boolean;
}

const ICON_SIZE = 20;

export const ProfilDetailButton = (props: Props) => (
  <View>
    <ButtonContainer>
      <RTLView>
        <Icon
          name={props.iconName}
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={theme.colors.black}
        />
        <StyledCategoryText isRTL={props.isRTL}>
          {props.category}
        </StyledCategoryText>
      </RTLView>
      <RTLView>
        {props.userChoice && (
          <StyledChoiceText isRTL={props.isRTL}>
            {props.userChoice}
          </StyledChoiceText>
        )}
        <Icon
          name={
            props.isRTL ? "arrow-ios-back-outline" : "arrow-ios-forward-outline"
          }
          width={24}
          height={24}
          fill={theme.colors.darkGrey}
        />
      </RTLView>
    </ButtonContainer>
    {!props.isLast && <Separator />}
  </View>
);
