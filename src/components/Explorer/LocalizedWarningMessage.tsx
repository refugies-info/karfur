import * as React from "react";
import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { RTLView } from "../BasicComponents";
import { theme } from "../../theme";
import {
  TextSmallNormal
} from "../StyledText";
// import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

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

interface Props {
  totalContent: number;
  city: string;
  openModal: any;
}

export const LocalizedWarningMessage = (props: Props) => {
  return (
    <InfoMessage>
      <Icon
        name="info"
        height={24}
        width={24}
        fill={theme.colors.darkBlue}
      />
      <InfoMessageText>
        Tu peux voir {props.totalContent} fiches en tout,
        mais peu de fiches pour {props.city}.{" "}
        <Text
          onPress={props.openModal}
          style={{ textDecorationLine: "underline" }}
          accessibilityRole="button"
        >
          Pourquoi ?
        </Text>
      </InfoMessageText>
      <TouchableOpacity>
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
