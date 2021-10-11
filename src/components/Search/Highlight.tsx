import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { connectHighlight } from "react-instantsearch-native";
import { RTLTouchableOpacity } from "../BasicComponents";

interface Props {
  hit: any[]
  attribute: any
  highlight: any
}

const ContentContainer = styled(RTLTouchableOpacity)`
  background-color: ${theme.colors.white};
  padding-horizontal: ${theme.margin * 2}px;
  min-height: ${(props: { isDispo: boolean }) => (props.isDispo ? 80 : 72)}px;
  border-radius: ${theme.radius * 2}px;
  shadow-color: #212121;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 1;
  display: flex;
  align-items: center;
  flex: 1;
`;


const Highlight = ({ attribute, hit, highlight }: Props) => {
  const highlights = highlight({
    highlightProperty: "_highlightResult",
    attribute,
    hit,
  });

  return (
    <ContentContainer>
      {highlights.map(({ value, isHighlighted }: any, index: number) => {
        const style = {
          backgroundColor: isHighlighted ? "yellow" : "transparent",
        };

        return (
          <Text key={index} style={{...style }}>
            {value}
          </Text>
        );
      })}
    </ContentContainer>
  );
};


export default connectHighlight(Highlight);