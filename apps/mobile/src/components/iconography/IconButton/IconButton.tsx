import styled, { useTheme } from "styled-components/native";
import Icon from "../Icon";

const ButtonContainer = styled.TouchableOpacity<{
  borderColor: string;
  outlined: boolean;
}>`
  background-color: ${({ outlined, theme }) => (outlined ? "transparent" : theme.colors.white)};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  ${({ borderColor, outlined }) => (outlined ? `border: 1px solid ${borderColor};` : "")}
  padding: ${({ theme }) => theme.radius * 2}px;
  width: 48px;
  ${({ outlined, theme }) => (outlined ? "" : theme.shadows.lg)}
`;

const ICON_SIZE = 24;

export interface IconButtonProps {
  accessibilityLabel: string;
  color?: string;
  iconName: string;
  loading?: boolean;
  onPress: (event: any) => void;
  outlined?: boolean;
}

const IconButton = ({
  accessibilityLabel,
  color,
  iconName,
  loading = false,
  onPress,
  outlined = false,
}: IconButtonProps) => {
  const theme = useTheme();
  return (
    <ButtonContainer
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      borderColor={color || theme.colors.black}
      onPress={onPress}
      outlined={outlined}
    >
      <Icon color={color || theme.colors.black} loading={loading} name={iconName} size={ICON_SIZE} />
    </ButtonContainer>
  );
};

export default IconButton;
