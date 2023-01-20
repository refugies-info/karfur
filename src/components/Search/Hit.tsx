import React, { useCallback } from "react";
import { View } from "react-native";
import { SearchContentSummary } from "../Search/SearchContentSummary";
import { styles } from "../../theme";
//@ts-ignore: not exported by algolia types
import { connectHitInsights } from "react-instantsearch-native";
import aa from "search-insights";

const getLanguageMatch = (hit: any, selectedLanguage: string) => {
  const props = Object.keys(hit._highlightResult);
  for (const prop of props) {
    if (hit._highlightResult[prop].matchLevel === "full") {
      return prop.split("_")[1];
    }
  }
  return selectedLanguage;
};

const hasSponsorMatch = (hit: any) =>
  hit._highlightResult?.sponsorName?.matchLevel === "full";

interface Props {
  hit: any;
  navigation: any;
  selectedLanguage: string | null;
  nbContents: any;
  insights: any;
}

const Hit = ({
  hit,
  navigation,
  selectedLanguage,
  nbContents,
  insights,
}: Props) => {
  const sendAlgoliaEvent = useCallback(() => {
    insights("clickedObjectIDsAfterSearch", {
      eventName: "Card clicked",
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
        marginBottom: styles.margin * 2,
        paddingHorizontal: styles.margin * 3,
      }}
      onTouchEnd={sendAlgoliaEvent}>
      <SearchContentSummary
        navigation={navigation}
        item={hit}
        languageMatch={getLanguageMatch(hit, selectedLanguage || "fr")}
        hasSponsorMatch={hasSponsorMatch(hit)}
        nbContents={
          hit.typeContenu === "besoin" ? nbContents[hit.objectID] : null
        }
      />
    </View>
  );
};

export const HitWithInsights = connectHitInsights(aa)(Hit);
