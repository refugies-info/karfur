import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { styles } from "../theme";

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${styles.colors.white};
  border-radius: ${(props: { rounded: boolean }) =>
    !props.rounded ? styles.radius * 2 : styles.radius * 10}px;
  padding: ${styles.radius * 2}px;
  ${styles.shadows.lg}
`;

const ICON_SIZE = 24;

interface Props {
  iconName: string;
  onPress?: () => void;
  rounded?: boolean;
  style?: any;
  label?: string;
}
/**
 * @deprecated Use IconButton instead
 * @param props
 * @returns
 */
export const SmallButton = (props: Props) => (
  <ButtonContainer
    onPress={props.onPress}
    rounded={!!props.rounded}
    style={props.style || {}}
    accessibilityRole="button"
    accessible={true}
    accessibilityLabel={props.label || ""}
  >
    <Icon
      name={props.iconName}
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill={styles.colors.black}
    />
  </ButtonContainer>
);
