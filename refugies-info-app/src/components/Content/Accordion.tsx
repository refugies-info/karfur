import * as React from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { theme } from "../../theme";
import { TextSmallBold } from "../StyledText";
import { RTLTouchableOpacity } from "../BasicComponents";
import { ContentFromHtml } from "./ContentFromHtml";

interface Props {
  title: string;
  content: string;
  isExpanded: boolean;
  toggleAccordion: () => void;
}

const TitleContainer = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.lightBlue};
  margin-bottom: 10px;
`;
export const Accordion = (props: Props) => {
  return (
    <View>
      <TitleContainer onPress={props.toggleAccordion}>
        <TextSmallBold>{props.title}</TextSmallBold>
      </TitleContainer>
      {props.isExpanded && <ContentFromHtml htmlContent={props.content} />}
    </View>
  );
};
