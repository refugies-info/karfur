import React from "react";
import { Text } from "react-native";
import { connectHighlight } from "react-instantsearch-native";
import { theme } from "../../theme";
import { firstLetterUpperCase } from "../../libs";

interface Props {
  hit: any[];
  attribute: any;
  highlight: any;
  capitalize?: boolean;
}

const Highlight = ({ attribute, hit, highlight, capitalize }: Props) => {
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
            {index === 0 && !!capitalize ? firstLetterUpperCase(value) : value}
          </Text>
        );
      })}
    </Text>
  );
};


export default connectHighlight(Highlight);