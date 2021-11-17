import * as React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { RTLView } from "../BasicComponents";
import { theme } from "../../theme";
import {
  TextSmallNormal,
  TextSmallBold,
} from "../StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const InfoMessage = styled(RTLView)`
  background-color: ${theme.colors.lightBlue};
  border-radius: ${theme.radius}px;
  box-shadow: 1px 1px 2px rgba(33, 33, 33, 0.4);
  elevation: 2;
  margin-top: ${theme.margin * 2}px;
  margin-horizontal: ${theme.margin * 3}px;
  padding: ${theme.margin}px;
`;
const InfoMessageText = styled(TextSmallNormal)`
  color: ${theme.colors.darkBlue};
  margin-horizontal: ${theme.margin}px;
  flex-shrink: 1;
`;
const InfoMessageLink = styled(TextSmallBold)`
  color: ${theme.colors.darkBlue};
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
        fill={theme.colors.darkBlue}
      />
      <InfoMessageText>
        {t("ExplorerScreen.Tu vois peu de fiches pour ta ville", {
          nbContent: props.totalContent,
          city: props.city
        })}{" "}
        <InfoMessageLink
          onPress={props.openModal}
          accessibilityRole="button"
        >
          {t("ExplorerScreen.Pourquoi")}
        </InfoMessageLink>
      </InfoMessageText>
      <TouchableOpacity
        onPress={props.onClose}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel={t("Fermer", "Fermer")}
      >
        <Icon
          name="close-outline"
          height={24}
          width={24}
          fill={theme.colors.darkBlue}
        />
      </TouchableOpacity>
    </InfoMessage>
  );
};
