import React from "react";
import { Text } from "react-native";
import { connectHighlight } from "react-instantsearch-native";
import { styles } from "../../theme";
import { firstLetterUpperCase } from "../../libs";

interface Props {
  hit: any[];
  attribute: string;
  highlight: any;
  capitalize?: boolean;
  color?: string;
  colorNotHighlighted?: string;
}

const Highlight = ({ attribute, hit, highlight, capitalize, color, colorNotHighlighted }: Props) => {
  const highlights = highlight({
    highlightProperty: "_highlightResult",
    attribute,
    hit,
  });

  return (
    <Text>
      {highlights.map(({ value, isHighlighted }: any, index: number) => {
        const style: any = isHighlighted ? {
          backgroundColor: styles.colors.lightBlue,
          fontFamily:styles.fonts.families.circularBold,
        } : {
          backgroundColor: "transparent",
          fontFamily: styles.fonts.families.circularStandard,
        };

        if (color) {
          style.color = isHighlighted ? color : `${colorNotHighlighted || color}B3`;
        }

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