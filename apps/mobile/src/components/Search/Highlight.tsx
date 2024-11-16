import { Hit } from "algoliasearch";
import { getHighlightedParts, getPropertyByPath, unescape } from "instantsearch.js/es/lib/utils";
import {} from "react-instantsearch-core";
import { Text } from "react-native";
import { firstLetterUpperCase } from "~/libs";
import { styles } from "~/theme";

interface Props {
  hit: Hit;
  attribute: string;
  capitalize?: boolean;
  color?: string;
  colorNotHighlighted?: string;
}

const Highlight = ({ attribute, hit, capitalize, color, colorNotHighlighted }: Props) => {
  const property = getPropertyByPath(hit._highlightResult, attribute as string) || [];
  const properties = Array.isArray(property) ? property : [property];

  const parts = properties.map((singleValue) => getHighlightedParts(unescape(singleValue.value || "")));

  return (
    <Text>
      {parts.map(({ value, isHighlighted }: any, index: number) => {
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

export default Highlight;
