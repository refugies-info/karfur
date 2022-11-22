import * as React from "react";
import { Icon } from "react-native-eva-icons";
import styled, { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";
import { RTLTouchableOpacity } from "../../BasicComponents";
import { Columns } from "../../layout";
import RadioButton from "../RadioButton";

export interface ChoiceButtonProps {
  children: React.ReactNode;
  label: string;
  selected: boolean;
  onPress: () => void;
  details?: undefined | string[];
}

const MainContainer = styled(RTLTouchableOpacity)<{
  selected: boolean;
  flatStyle: boolean;
}>`
  background-color: ${({ selected, flatStyle, theme }) =>
    selected
      ? theme.colors.lightBlue
      : flatStyle
      ? "transparent"
      : theme.colors.white};
  ${({ selected, flatStyle, theme }) =>
    selected || flatStyle ? "" : theme.shadows.lg};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  margin-bottom: ${({ flatStyle, theme }) =>
    !flatStyle ? theme.margin * 3 : 0}px;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.margin * 2 - 2}px;
  border-width: 2px;
  border-color: ${({ selected, flatStyle, theme }) =>
    selected
      ? theme.colors.darkBlue
      : flatStyle
      ? "transparent"
      : theme.colors.white};
`;

const ChoiceButton = ({
  children,
  label,
  selected,
  onPress,
}: ChoiceButtonProps) => {
  const theme = useTheme();
  const { t } = useTranslationWithRTL();
  return (
    <MainContainer
      accessibilityRole="radio"
      flatStyle={false}
      selected={selected}
      onPress={onPress}
      testID={`test-filter-${label}`}
    >
      <Columns RTLBehaviour layout="1 auto" verticalAlign="center">
        {children}
        <RadioButton selected={selected}>
          {selected && (
            <Icon
              name="checkmark-outline"
              width={16}
              height={16}
              fill={theme.colors.white}
            />
          )}
        </RadioButton>
      </Columns>
    </MainContainer>
  );
};

export default ChoiceButton;
