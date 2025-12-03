import { Image, View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks";
import IlluMascotte from "~/theme/images/profile/illu-mascotte.png";
import { TextBubble } from "~/theme/images/profile/TextBubble";
import { Columns } from "../layout";
import { TextDSFR_MD } from "../StyledText";

const Text = styled(TextDSFR_MD)`
  color: ${({ theme }) => theme.colors.dsfr_action};
  z-index: 2;
  padding: ${({ theme }) => theme.margin * 1.5}px;
  padding-right: ${({ theme }) => theme.margin * 3}px;
`;

export const MascotteSpeaking = () => {
  const theme = useTheme();
  const { t } = useTranslationWithRTL();

  return (
    <Columns
      layout="1 auto"
      verticalAlign="center"
      style={{
        marginTop: theme.margin * 3,
        marginBottom: theme.margin * 5,
      }}
    >
      <View style={{ position: "relative" }}>
        <Text>{t("profile_screens.help_bubble")}</Text>
        <TextBubble />
      </View>
      <Image style={{ height: 96, width: 77 }} source={IlluMascotte} />
    </Columns>
  );
};
