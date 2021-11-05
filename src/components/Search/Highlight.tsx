import React from "react";
import { Text } from "react-native";
import { connectHighlight } from "react-instantsearch-native";
import { theme } from "../../theme";

interface Props {
  hit: any[];
  attribute: any;
  highlight: any;
}

const Highlight = ({ attribute, hit, highlight }: Props) => {
  const highlights = highlight({
    highlightProperty: "_highlightResult",
    attribute,
    hit,
  });

  return (
    <Text>
      {highlights.map(({ value, isHighlighted }: any, index: number) => {
        const style = isHighlighted ? {
          backgroundColor: theme.colors.yellow,
          fontFamily:theme.fonts.families.circularBold,
          color:  theme.colors.black,
        } : {
          backgroundColor: "transparent",
          fontFamily: theme.fonts.families.circularStandard,
        };

        return (
          <Text key={index} style={style}>
            {value}
          </Text>
        );
      })}
    </Text>
  );
};


export default connectHighlight(Highlight);