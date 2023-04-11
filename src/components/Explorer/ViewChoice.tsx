import { RTLTouchableOpacity } from "../BasicComponents";
import { styles } from "../../theme";
import React from "react";
import styled from "styled-components/native";
import { TextVerySmallBold, TextVerySmallNormal } from "../StyledText";
import GalerieFill from "../../theme/images/streamlineIcons/galerie-fill.svg";
import GalerieOutline from "../../theme/images/streamlineIcons/galerie-outline.svg";
import ListFill from "../../theme/images/streamlineIcons/list-fill.svg";
import ListOutline from "../../theme/images/streamlineIcons/list-outline.svg";
import { useTranslationWithRTL } from "../../hooks";

const ICON_SIZE = 16;

const ChoiceTextBold = styled(TextVerySmallBold)`
  margin-left: ${styles.margin}px;
  margin-right: ${styles.margin}px;
`;

const ChoiceText = styled(TextVerySmallNormal)`
  margin-left: ${styles.margin}px;
  margin-right: ${styles.margin}px;
`;

const StyledButton = styled(RTLTouchableOpacity)`
  padding-horizontal: ${styles.margin * 3}px;
  padding-vertical: ${styles.margin * 2}px;
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? styles.colors.white : "transparent"};
  border-radius: ${styles.radius * 2}px;
  flex-basis: 50%;
  justify-content: center;
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
  const { t } = useTranslationWithRTL();

  return (
    <StyledButton
      onPress={props.onPress}
      accessibilityRole="button"
      isSelected={props.isSelected}
    >
      <StreamlineIcon name={props.iconName} isSelected={props.isSelected} />
      {props.isSelected ? (
        <ChoiceTextBold>
          {t("explorer_screen." + props.text, props.text)}
        </ChoiceTextBold>
      ) : (
        <ChoiceText>
          {t("explorer_screen." + props.text, props.text)}
        </ChoiceText>
      )}
    </StyledButton>
  );
};
