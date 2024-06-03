import * as React from "react";
import styled from "styled-components/native";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import { styles } from "../../theme";
import { Icon } from "react-native-eva-icons";
import { StyledTextSmallBold, StyledTextVerySmall } from "../StyledText";
import { View } from "react-native";

const ButtonContainer = styled(RTLTouchableOpacity)<{ inList: boolean }>`
  align-items: center;
  justify-content: space-between;
  padding-vertical: ${styles.margin * 2}px;
  ${({ inList, theme }) =>
    !inList
      ? `
  padding-horizontal: ${styles.margin * 2}px;
  margin-bottom: ${styles.margin * 2}px;
  border: 1px solid ${theme.colors.dsfr_borderGrey};
  background-color: ${theme.colors.white};
  ${theme.shadows.sm_dsfr}
  `
      : ""}
`;

const LabelContainer = styled(RTLView)`
  flex-grow: 0;
  flex-shrink: 1;
  gap: ${styles.margin * 2}px;
`;

const StyledLabel = styled(StyledTextSmallBold)<{ isEmpty: boolean }>`
  flex: 1;
  ${({ isEmpty, theme }) =>
    isEmpty
      ? `
color: ${theme.colors.dsfr_disabledGrey};
`
      : ""}
`;

type IconRight = "edit" | "navigate" | "external";

interface Props {
  iconName?: string;
  iconImage?: React.ReactNode;
  label: string;
  onPress?: () => void;
  inList?: boolean;
  isEmpty?: boolean;
  iconRight: IconRight;
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
    testID={"test-profil-button-" + props.iconName}
    accessibilityRole="button"
    inList={!!props.inList}
  >
    <LabelContainer>
      {props.iconName && (
        <Icon
          name={props.iconName}
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={
            props.isEmpty
              ? styles.colors.dsfr_disabledGrey
              : styles.colors.black
          }
        />
      )}
      {props.iconImage}
      <StyledLabel numberOfLines={1} isEmpty={!!props.isEmpty}>
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
          fill={styles.colors.dsfr_mentionGrey}
        />
      )}
    </RTLView>
  </ButtonContainer>
);
