import * as React from "react";
import styled from "styled-components/native";
import { StyledTextSmall } from "../StyledText";
import { Image, View } from "react-native";
import { useTheme } from "styled-components/native";
import { Columns } from "../layout";
import { TextBubble } from "../../theme/images/profile/TextBubble";
import IlluMascotte from "../../theme/images/profile/illu-mascotte.png";

const Text = styled(StyledTextSmall)`
  color: ${({ theme }) => theme.colors.dsfr_action};
  z-index: 2;
  padding: ${({ theme }) => theme.margin * 1.5}px;
  padding-right: ${({ theme }) => theme.margin * 3}px;
`;

interface Props {}

export const MascotteSpeaking = (props: Props) => {
  const theme = useTheme();
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
        <Text>
          Grâce à ces information, tu vois seulement les fiches intéressantes
          pour toi.
        </Text>
        <TextBubble />
      </View>
      <Image style={{ height: 96, width: 77 }} source={IlluMascotte} />
    </Columns>
  );
};
