import styled from "styled-components/native";

export interface RadioButtonProps {
  selected: boolean;
}

const RadioButton = styled.View<RadioButtonProps>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ selected, theme }) =>
    selected ? "transparent" : theme.colors.darkGrey};
  background-color: ${({ selected, theme }) =>
    !selected ? "transparent" : theme.colors.darkBlue};
  align-items: center;
  justify-content: center;
`;

export default RadioButton;
