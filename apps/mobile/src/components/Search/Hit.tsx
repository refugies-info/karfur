import { useCallback } from "react";
import { View } from "react-native";
import aa from "search-insights";
import { styles } from "~/theme";
import { SearchContentSummary } from "../Search/SearchContentSummary";

const getLanguageMatch = (hit: any, selectedLanguage: string) => {
  const props = Object.keys(hit._highlightResult);
  for (const prop of props) {
    if (hit._highlightResult[prop].matchLevel === "full") {
      return prop.split("_")[1];
    }
  }
  return selectedLanguage;
};

const hasSponsorMatch = (hit: any) => hit._highlightResult?.sponsorName?.matchLevel === "full";

interface Props {
  hit: any;
  navigation: any;
  selectedLanguage: string | null;
  nbContents: any;
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
        languageMatch={getLanguageMatch(hit, selectedLanguage || "fr")}
        hasSponsorMatch={hasSponsorMatch(hit)}
        nbContents={hit.typeContenu === "besoin" ? nbContents[hit.objectID] : null}
        pressCallback={sendAlgoliaEvent}
      />
    </View>
  );
};
