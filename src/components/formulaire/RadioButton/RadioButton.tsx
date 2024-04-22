import React from "react";
import { Icon } from "react-native-eva-icons";
import { useTheme } from "styled-components/native";

interface Props {
  isSelected: boolean;
}

export const RadioButton = (props: Props) => {
  const theme = useTheme();
  return (
    <Icon
      name={props.isSelected ? "radio-button-on" : "radio-button-off"}
      width={24}
      height={24}
      fill={
        props.isSelected ? theme.colors.dsfr_action : theme.colors.dsfr_dark
      }
    />
  );
};

export default RadioButton;
