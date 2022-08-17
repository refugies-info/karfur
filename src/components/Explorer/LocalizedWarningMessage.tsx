import * as React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { RTLView } from "../BasicComponents";
import { styles } from "../../theme";
import {
  TextSmallNormal,
  TextSmallBold,
} from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const InfoMessage = styled(RTLView)`
  background-color: ${styles.colors.lightBlue};
  border-radius: ${styles.radius}px;
  ${styles.shadows.sm}
  margin-top: ${styles.margin * 2}px;
  margin-horizontal: ${styles.margin * 3}px;
  padding: ${styles.margin}px;
`;
const InfoMessageText = styled(TextSmallNormal)`
  color: ${styles.colors.darkBlue};
  margin-horizontal: ${styles.margin}px;
  flex-shrink: 1;
`;
const InfoMessageLink = styled(TextSmallBold)`
  color: ${styles.colors.darkBlue};
  text-decoration-line: underline;
`;

interface Props {
  totalContent: number;
  city: string;
  openModal: any;
  onClose: any;
}

export const LocalizedWarningMessage = (props: Props) => {
  const { t } = useTranslationWithRTL();

  return (
    <InfoMessage>
      <Icon
        name="info"
        height={24}
        width={24}
        fill={styles.colors.darkBlue}
      />
      <InfoMessageText>
        {t("explorer_screen.warning_nb_contents", {
          nbContent: props.totalContent,
          city: props.city
        })}{" "}
        <InfoMessageLink
          onPress={props.openModal}
          accessibilityRole="button"
          accessible={true}
        >
          {t("explorer_screen.why_link")}
        </InfoMessageLink>
      </InfoMessageText>
      <TouchableOpacity
        onPress={props.onClose}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel={t("global.close", "Fermer")}
      >
        <Icon
          name="close-outline"
          height={24}
          width={24}
          fill={styles.colors.darkBlue}
        />
      </TouchableOpacity>
    </InfoMessage>
  );
};
