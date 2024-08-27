import styled from "styled-components/native";
import { TextDSFR_S_Bold } from "../../StyledText";
import { Icon } from "../../iconography";

export const BadgeText = styled(TextDSFR_S_Bold)<{ color: string }>`
  color: ${({ color }) => color};
  text-transform: uppercase;
`;
export const Container = styled.View<{ background: string }>`
  background-color: ${({ background }) => background};
  border-radius: 4px;
  padding-left: ${({ theme }) => theme.margin}px;
  padding-right: ${({ theme }) => theme.margin * 2}px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.margin / 2}px;
  align-self: flex-start;
`;

type BadgeType = "success" | "error" | "info" | "warning" | "new";

const COLORS: Record<BadgeType, { text: string; background: string; icon: string }> = {
  success: {
    text: "#18753C",
    background: "#B8FEC9",
    icon: "checkmark-circle-2",
  },
  error: {
    text: "#CE0500",
    background: "#FFE9E9",
    icon: "close-circle",
  },
  info: {
    text: "#0063CB",
    background: "#E8EDFF",
    icon: "info",
  },
  warning: {
    text: "#B34000",
    background: "#FFE9E6",
    icon: "alert-triangle",
  },
  new: {
    text: "#716043",
    background: "#FEECC2",
    icon: "flash",
  },
};

interface Props {
  type?: BadgeType;
  text: string;
  icon?: string;
}

const Badge = ({ type = "info", text, icon }: Props) => {
  const colors = COLORS[type];

  return (
    <Container background={colors.background}>
      <Icon name={icon || colors.icon} size={16} color={colors.text} />
      <BadgeText color={colors.text}>{text}</BadgeText>
    </Container>
  );
};

export default Badge;
