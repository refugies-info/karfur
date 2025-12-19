import type { Hit } from "algoliasearch";
import { getHighlightedParts, getPropertyByPath, unescape } from "instantsearch.js/es/lib/utils";
import { Text, type TextStyle } from "react-native";
import type { SearchItem } from "~/components/Search/types";
import { firstLetterUpperCase } from "~/libs";
import { styles } from "~/theme";

interface Props {
  hit: Hit<SearchItem>;
  attribute: string;
  capitalize?: boolean;
  color?: string;
  colorNotHighlighted?: string;
}

const Highlight = ({ attribute, hit, capitalize, color, colorNotHighlighted }: Props) => {
  // See https://github.com/algolia/instantsearch/discussions/5322#discussioncomment-3135852
  const property = getPropertyByPath(hit._highlightResult, attribute as string) || [];
  const properties = Array.isArray(property) ? property : [property];

  const parts = properties.flatMap((singleValue) =>
    getHighlightedParts(unescape(singleValue.value || "")),
  );
  return (
    <Text>
      {parts.map(
        ({ value, isHighlighted }: { value: string; isHighlighted: boolean }, index: number) => {
          const baseStyle: TextStyle = isHighlighted
            ? {
                backgroundColor: styles.colors.lightBlue,
                fontFamily: styles.fonts.families.marianneBold,
                color: color ? color : undefined,
              }
            : {
                backgroundColor: "transparent",
                fontFamily: styles.fonts.families.marianneReg,
                color: color ? `${colorNotHighlighted || color}B3` : undefined,
              };

          // Filter out undefined values to avoid React Native warnings
          const style = Object.fromEntries(
            Object.entries(baseStyle).filter(([_, value]) => value !== undefined),
          ) as Record<string, string>;

          return (
            <Text key={index} style={style}>
              {index === 0 && !!capitalize ? firstLetterUpperCase(value) : value}
            </Text>
          );
        },
      )}
    </Text>
  );
};

export default Highlight;
