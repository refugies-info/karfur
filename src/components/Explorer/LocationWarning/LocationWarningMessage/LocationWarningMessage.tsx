import * as React from "react";
import { Pressable } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { RTLView } from "../../../BasicComponents";
import { useTranslationWithRTL } from "../../../../hooks/useTranslationWithRTL";
import { Columns } from "../../../layout";
import { TextSmallBold, TextSmallNormal } from "../../../StyledText";

const InfoMessage = styled(RTLView)`
  background-color: ${({ theme }) => theme.colors.lightBlue};
  border-radius: ${({ theme }) => theme.radius}px;
  ${({ theme }) => theme.shadows.sm}
  margin-top: ${({ theme }) => theme.margin * 2}px;
  margin-horizontal: ${({ theme }) => theme.margin * 3}px;
  padding: ${({ theme }) => theme.margin}px;
`;

const InfoMessageText = styled(TextSmallNormal)`
  color: ${({ theme }) => theme.colors.darkBlue};
  margin-horizontal: ${({ theme }) => theme.margin}px;
  flex-shrink: 1;
`;
const InfoMessageLink = styled(TextSmallBold)`
  color: ${({ theme }) => theme.colors.darkBlue};
  text-decoration-line: underline;
`;

interface LocalizedWarningMessageProps {
  city: string;
  onClose: any;
  onPress: any;
  totalContent: number;
}

const LocationWarningMessage = ({
  city,
  onClose,
  onPress,
  totalContent,
}: LocalizedWarningMessageProps) => {
  const { t } = useTranslationWithRTL();
  const theme = useTheme();

  return (
    <InfoMessage>
      <Columns layout="1 auto" verticalAlign="center">
        <Pressable onPress={onPress}>
          <Columns layout="auto 1" verticalAlign="center">
            <Icon
              name="info"
              height={24}
              width={24}
              fill={theme.colors.darkBlue}
            />
            <InfoMessageText>
              {t("explorer_screen.warning_nb_contents", {
                nbContent: totalContent,
                city: city,
              })}{" "}
              <InfoMessageLink
                onPress={onPress}
                accessibilityRole="button"
                accessible={true}
              >
                {t("explorer_screen.why_link")}
              </InfoMessageLink>
            </InfoMessageText>
          </Columns>
        </Pressable>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel={t("global.close", "Fermer")}
        >
          <Icon
            name="close-outline"
            height={24}
            width={24}
            fill={theme.colors.darkBlue}
          />
        </Pressable>
      </Columns>
    </InfoMessage>
  );
};

export default LocationWarningMessage;
