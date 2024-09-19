import { connectHighlight } from "react-instantsearch-native";
import { Text } from "react-native";
import { firstLetterUpperCase } from "~/libs";
import { styles } from "~/theme";

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
        const style: any = isHighlighted
          ? {
              backgroundColor: styles.colors.lightBlue,
              fontFamily: styles.fonts.families.marianneBold,
            }
          : {
              backgroundColor: "transparent",
              fontFamily: styles.fonts.families.marianneReg,
            };

        if (color) {
          style.color = isHighlighted ? color : `${colorNotHighlighted || color}B3`;
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
