import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { styles } from "../../theme";
import { Icon } from "react-native-eva-icons";
import { StyledTextSmallBold, StyledTextVerySmall } from "../StyledText";
import { View } from "react-native";

const ButtonContainer = styled(RTLTouchableOpacity)`
  align-items: center;
  height: 56px;
  padding-left: ${styles.margin * 2}px;
  padding-right: ${styles.margin}px;

  justify-content: space-between;
`;

const StyledCategoryText = styled(StyledTextSmallBold)<{ isRTL: boolean }>`
  margin-left: ${({ isRTL }) => (isRTL ? 0 : styles.margin)}px;
  margin-right: ${({ isRTL }) => (!isRTL ? 0 : styles.margin)}px;
`;

const StyledChoiceText = styled(StyledTextVerySmall)<{ isRTL: boolean }>`
  color: ${styles.colors.darkGrey};
  margin-right: ${({ isRTL }) => (isRTL ? 0 : styles.margin)}px;
  margin-left: ${({ isRTL }) => (!isRTL ? 0 : styles.margin)}px;
  max-width: 150px;
  flex-shrink: 1;
  text-align: ${({ isRTL }) => (isRTL ? "left" : "right")};
`;

const Separator = styled.View`
  height: 1px;
  background-color: ${styles.colors.grey};
`;

interface Props {
  iconName?: string;
  iconImage?: any;
  category: string;
  userChoice?: string;
  isFirst: boolean;
  isLast: boolean;
  isRTL: boolean;
  onPress?: any;
}

const ICON_SIZE = 20;

export const ProfilDetailButton = (props: Props) => (
  <View>
    <ButtonContainer
      onPress={props.onPress}
      testID={"test-profil-button-" + props.iconName}
      accessibilityRole="button"
    >
      <RTLView style={{ flexGrow: 0, flexShrink: 1 }}>
        {props.iconName && (
          <Icon
            name={props.iconName}
            width={ICON_SIZE}
            height={ICON_SIZE}
            fill={styles.colors.black}
          />
        )}
        {props.iconImage && (
          <props.iconImage width={ICON_SIZE} height={ICON_SIZE} />
        )}
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
          fill={styles.colors.darkGrey}
        />
      </RTLView>
    </ButtonContainer>
    {!props.isLast && <Separator />}
  </View>
);
