import { Pressable } from "react-native";
import { Icon } from "react-native-eva-icons";
import styled, { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { RTLView } from "../../../BasicComponents";
import { Columns } from "../../../layout";
import { TextDSFR_MD, TextDSFR_MD_Bold } from "../../../StyledText";

const InfoMessage = styled(RTLView)`
  background-color: ${({ theme }) => theme.colors.lightBlue};
  border-radius: ${({ theme }) => theme.radius}px;
  ${({ theme }) => theme.shadows.sm}
  margin-top: ${({ theme }) => theme.margin * 2}px;
  padding: ${({ theme }) => theme.margin}px;
`;

const InfoMessageText = styled(TextDSFR_MD)`
  color: ${({ theme }) => theme.colors.darkBlue};
  margin-horizontal: ${({ theme }) => theme.margin}px;
  flex-shrink: 1;
`;
const InfoMessageLink = styled(TextDSFR_MD_Bold)`
  color: ${({ theme }) => theme.colors.darkBlue};
  text-decoration-line: underline;
`;

interface LocalizedWarningMessageProps {
  city: string;
  onClose: any;
  onPress: any;
  totalContent: number;
}

const LocationWarningMessage = ({ city, onClose, onPress, totalContent }: LocalizedWarningMessageProps) => {
  const { t } = useTranslationWithRTL();
  const theme = useTheme();

  return (
    <InfoMessage>
      <Columns layout="1 auto" verticalAlign="center">
        <Pressable onPress={onPress}>
          <Columns layout="auto 1" verticalAlign="center">
            <Icon name="info" height={24} width={24} fill={theme.colors.darkBlue} />
            <InfoMessageText>
              {t("explorer_screen.warning_nb_contents", {
                nbContent: totalContent,
                city: city,
              })}{" "}
              <InfoMessageLink onPress={onPress} accessibilityRole="button" accessible={true}>
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
          <Icon name="close-outline" height={24} width={24} fill={theme.colors.darkBlue} />
        </Pressable>
      </Columns>
    </InfoMessage>
  );
};

export default LocationWarningMessage;
