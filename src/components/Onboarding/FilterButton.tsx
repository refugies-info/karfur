import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { theme } from "../../theme";
import { TextSmallBold } from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { Icon } from "react-native-eva-icons";

interface Props {
  text: string;
  isSelected: boolean;
  onPress: () => void;
  details?: undefined | string[];
}

const MainContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.lightBlue : theme.colors.white};
  padding: ${theme.margin * 2}px;
  box-shadow: ${(props: { isSelected: boolean }) =>
   props.isSelected ? "none" : "1px 1px 8px rgba(33, 33, 33, 0.24)"};
  border-radius: ${theme.radius * 2}px;
  margin-bottom: ${theme.margin * 3}px;
  justify-content: space-between;
  flex-wrap: wrap;
  elevation: ${(props: { isSelected: boolean }) =>
  props.isSelected ? 0 : 2};
  border-width: 2px;
  border-color: ${(props: { isSelected: boolean }) =>
  props.isSelected ? theme.colors.darkBlue : "transparent"};
`;

const StyledText = styled(TextSmallBold)`
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.darkBlue : theme.colors.black};
`;

const RadioButton = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${(props: { isSelected: boolean }) =>
  props.isSelected ? "transparent" : theme.colors.darkGrey};
  background-color: ${(props: { isSelected: boolean }) =>
  !props.isSelected ? "transparent" : theme.colors.darkBlue};
  align-items: center;
  justify-content: center;
`;

export const FilterButton = (props: Props) => {
  const { t } = useTranslationWithRTL();
  return (
    <MainContainer
      onPress={props.onPress}
      isSelected={props.isSelected}
      testID={`test-filter-${props.text}`}
      accessibilityRole="radio"
    >
      <RTLView style={{ justifyContent: "space-between", flex: 1 }}>
        <StyledText isSelected={props.isSelected}>
          {t("filters." + props.text, props.text)}
          {props.details &&
            <StyledText isSelected={props.isSelected}>
            {" "}({props.details.join("/")})
            </StyledText>
          }
        </StyledText>
        <RadioButton isSelected={props.isSelected}>
          {props.isSelected &&
            <Icon
              name="checkmark-outline"
              width={16}
              height={16}
              fill={theme.colors.white}
            />
          }
        </RadioButton>
      </RTLView>
    </MainContainer>
  );
};
