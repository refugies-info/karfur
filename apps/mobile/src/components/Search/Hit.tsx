import type { CompositeNavigationProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useCallback } from "react";
import { View } from "react-native";
import aa from "search-insights";
import type { SearchItem } from "~/components/Search/types";
import { styles } from "~/theme";
import type { ExplorerParamList, RootStackParamList } from "~/types/navigation";
import { SearchContentSummary } from "../Search/SearchContentSummary";

interface HighlightResult {
  [key: string]: {
    matchLevel: string;
  };
}

// Define Algolia-specific fields
export type AlgoliaMetadata = {
  _highlightResult: HighlightResult;
  __index: string;
  __queryID: string;
  __position: number;
};

type AlgoliaHit = SearchItem & AlgoliaMetadata;

const getLanguageMatch = (hit: AlgoliaHit, selectedLanguage: string) => {
  const props = Object.keys(hit._highlightResult);
  for (const prop of props) {
    if (hit._highlightResult[prop].matchLevel === "full") {
      return prop.split("_")[1];
    }
  }
  return selectedLanguage;
};

const hasSponsorMatch = (hit: AlgoliaHit) =>
  hit._highlightResult?.sponsorName?.matchLevel === "full";

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList>,
  StackNavigationProp<ExplorerParamList>
>;

interface Props {
  hit: SearchItem & AlgoliaMetadata;
  navigation: NavigationProp;
  selectedLanguage: string | null;
  nbContents: Record<string, number> | null;
}

export const HitWithInsights = ({ hit, navigation, selectedLanguage, nbContents }: Props) => {
  const sendAlgoliaEvent = useCallback(async () => {
    await aa("clickedObjectIDsAfterSearch", {
      eventName: "Card clicked",
      index: hit.__index,
      queryID: hit.__queryID,
      positions: [hit.__position],
      objectIDs: [hit.objectID],
    });
  }, [hit]);

  return (
    <View
      key={hit.objectID}
      style={{
        flex: 1,
        paddingHorizontal: styles.margin * 3,
      }}
    >
      <SearchContentSummary
        navigation={navigation}
        item={hit}
        languageMatch={getLanguageMatch(hit as AlgoliaHit, selectedLanguage || "")}
        hasSponsorMatch={hasSponsorMatch(hit as AlgoliaHit)}
        nbContents={
          hit.typeContenu === "besoin" && nbContents ? (nbContents[hit.objectID] ?? 0) : null
        }
        pressCallback={sendAlgoliaEvent}
      />
    </View>
  );
};
