import * as React from "react";
import { Image, View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { TextDSFR_MD } from "../StyledText";
import { Columns } from "../layout";
import { TextBubble } from "../../theme/images/profile/TextBubble";
import IlluMascotte from "../../theme/images/profile/illu-mascotte.png";
import { useTranslationWithRTL } from "../../hooks";

const Text = styled(TextDSFR_MD)`
  color: ${({ theme }) => theme.colors.dsfr_action};
  z-index: 2;
  padding: ${({ theme }) => theme.margin * 1.5}px;
  padding-right: ${({ theme }) => theme.margin * 3}px;
`;

interface Props {}

export const MascotteSpeaking = (props: Props) => {
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
