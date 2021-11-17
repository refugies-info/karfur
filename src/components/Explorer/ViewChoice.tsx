import { RTLTouchableOpacity } from "../BasicComponents";
import { theme } from "../../theme";
import React from "react";
import styled from "styled-components/native";
import { TextVerySmallBold, TextVerySmallNormal } from "../StyledText";
import GalerieFill from "../../theme/images/streamlineIcons/galerie-fill.svg";
import GalerieOutline from "../../theme/images/streamlineIcons/galerie-outline.svg";
import ListFill from "../../theme/images/streamlineIcons/list-fill.svg";
import ListOutline from "../../theme/images/streamlineIcons/list-outline.svg";
import { useTranslation } from "react-i18next";

const ICON_SIZE = 16;

const ChoiceTextBold = styled(TextVerySmallBold)`
  margin-left: ${theme.margin}px;
  margin-right: ${theme.margin}px;
`;

const ChoiceText = styled(TextVerySmallNormal)`
  margin-left: ${theme.margin}px;
  margin-right: ${theme.margin}px;
`;

const StyledButton = styled(RTLTouchableOpacity)`
  padding-horizontal: ${theme.margin * 3}px;
  padding-vertical: ${theme.margin * 2}px;
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? theme.colors.white : "transparent" };
  border-radius: ${theme.radius * 2}px;
  ${(props: { isSelected: boolean }) => props.isSelected ? `
  box-shadow: 1px 1px 8px rgba(33, 33, 33, 0.24);
  elevation: 7;
  ` : "" };
`;
interface Props {
  text: string;
  isSelected: boolean;
  iconName: string;
  onPress: () => void;
}

const StreamlineIcon = ({
  name,
  isSelected,
}: {
  name: string;
  isSelected: boolean;
}) => {
  if (name === "galery" && isSelected)
    return <GalerieFill width={ICON_SIZE} height={ICON_SIZE} />;
  if (name === "galery" && !isSelected)
    return <GalerieOutline width={ICON_SIZE} height={ICON_SIZE} />;
  if (name === "list" && isSelected)
    return <ListFill width={ICON_SIZE} height={ICON_SIZE} />;
  return <ListOutline width={ICON_SIZE} height={ICON_SIZE} />;
};
export const ViewChoice = (props: Props) => {
  const { t } = useTranslation();

  return (
    <StyledButton
      onPress={props.onPress}
      accessibilityRole="button"
      isSelected={props.isSelected}
    >
      <StreamlineIcon name={props.iconName} isSelected={props.isSelected} />
      {props.isSelected ? (
        <ChoiceTextBold>
          {t("ExplorerScreen." + props.text, props.text)}
        </ChoiceTextBold>
      ) : (
        <ChoiceText>{t("ExplorerScreen." + props.text, props.text)}</ChoiceText>
      )}
    </StyledButton>
  );
};
