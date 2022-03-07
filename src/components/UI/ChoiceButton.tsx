import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { theme } from "../../theme";
import { Icon } from "react-native-eva-icons";

interface Props {
  testID: string;
  isSelected: boolean;
  onPress: () => void;
  style?: any;
  flatStyle?: boolean;
  hideRadio?: boolean;
  accessibilityRole?: "button" | "radio";
  children: any;
}

const MainContainer = styled(RTLTouchableOpacity)`
  background-color: ${(props: { isSelected: boolean, flatStyle: boolean }) =>
    props.isSelected ? theme.colors.lightBlue : (props.flatStyle ? "transparent" : theme.colors.white)};
  ${(props: { isSelected: boolean, flatStyle: boolean }) =>
    props.isSelected || props.flatStyle ? "" : theme.shadows.lg};
  border-radius: ${theme.radius * 2}px;
  margin-bottom: ${(props: { flatStyle: boolean }) =>
    !props.flatStyle ? theme.margin * 3 : 0}px;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: ${theme.margin * 2 - 2}px;
  border-width: 2px;
  border-color: ${(props: { isSelected: boolean, flatStyle: boolean }) =>
    props.isSelected ? theme.colors.darkBlue : (props.flatStyle ? "transparent" : theme.colors.white)};
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

export const ChoiceButton = (props: Props) => {
  return (
    <MainContainer
      onPress={props.onPress}
      isSelected={props.isSelected}
      testID={props.testID}
      accessibilityRole={props.accessibilityRole || "radio"}
      style={props.style || {}}
      flatStyle={!!props.flatStyle}
    >
      <RTLView style={{ justifyContent: "space-between", flex: 1 }}>
        {props.children}
        {!props.hideRadio &&
          <RadioButton isSelected={props.isSelected}>
            {props.isSelected && (
              <Icon
                name="checkmark-outline"
                width={16}
                height={16}
                fill={theme.colors.white}
              />
            )}
          </RadioButton>
        }
      </RTLView>
    </MainContainer>
  );
};
