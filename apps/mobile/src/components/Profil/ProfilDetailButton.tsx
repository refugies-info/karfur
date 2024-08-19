import * as React from "react";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { styles } from "../../theme";
import { TextDSFR_MD_Med } from "../StyledText";

const ButtonContainer = styled(RTLTouchableOpacity)<{
  inList: boolean;
  purpleVariant: boolean;
}>`
  align-items: center;
  justify-content: space-between;
  padding-vertical: ${styles.margin * 2}px;
  ${({ inList, purpleVariant, theme }) =>
    !inList
      ? `
  padding-horizontal: ${styles.margin * 2}px;
  margin-bottom: ${styles.margin * 2}px;
  border: 1px solid ${theme.colors.dsfr_borderGrey};
  background-color: ${
    purpleVariant ? theme.colors.dsfr_backgroundBlue : theme.colors.white
  };
  ${!purpleVariant ? theme.shadows.sm_dsfr : ""}
  `
      : ""}
`;

const LabelContainer = styled(RTLView)`
  flex-grow: 0;
  flex-shrink: 1;
  gap: ${styles.margin * 2}px;
`;

const StyledLabel = styled(TextDSFR_MD_Med)<{
  isEmpty: boolean;
  purpleVariant: boolean;
  isBold: boolean;
}>`
  flex: 1;
  ${({ theme, isBold }) =>
    isBold ? `font-family: ${theme.fonts.families.marianneBold};` : ""}
  ${({ isEmpty, theme }) =>
    isEmpty ? `color: ${theme.colors.dsfr_disabledGrey};` : ""}
  ${({ purpleVariant, theme }) =>
    purpleVariant ? `color: ${theme.colors.dsfr_purple};` : ""}
`;

type IconRight = "edit" | "navigate" | "external";

interface Props {
  iconName?: string;
  iconImage?: React.ReactNode;
  label: string;
  onPress?: () => void;
  inList?: boolean;
  isEmpty?: boolean;
  isBold?: boolean;
  iconRight: IconRight;
  purpleVariant?: boolean;
  id?: string;
}

const ICON_SIZE = 24;
const ICONS: Record<IconRight, string> = {
  edit: "edit-2-outline",
  navigate: "arrow-ios-forward-outline",
  external: "external-link-outline",
};

export const ProfilDetailButton = (props: Props) => (
  <ButtonContainer
    onPress={props.onPress}
    testID={"test-profil-button-" + props.id || props.iconName}
    accessibilityRole="button"
    inList={!!props.inList}
    purpleVariant={!!props.purpleVariant}
  >
    <LabelContainer>
      {props.iconName && (
        <Icon
          name={props.iconName}
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={
            props.purpleVariant
              ? styles.colors.dsfr_purple
              : props.isEmpty
              ? styles.colors.dsfr_disabledGrey
              : styles.colors.black
          }
        />
      )}
      {props.iconImage}
      <StyledLabel
        numberOfLines={1}
        isEmpty={!!props.isEmpty}
        isBold={!!props.isBold}
        purpleVariant={!!props.purpleVariant}
      >
        {props.label}
      </StyledLabel>
    </LabelContainer>
    <RTLView>
      {props.isEmpty ? (
        <Icon
          name="plus-circle"
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={styles.colors.dsfr_success}
        />
      ) : (
        <Icon
          name={ICONS[props.iconRight]}
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={
            props.purpleVariant
              ? styles.colors.dsfr_purple
              : styles.colors.dsfr_mentionGrey
          }
        />
      )}
    </RTLView>
  </ButtonContainer>
);
