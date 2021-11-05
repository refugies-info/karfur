import React from "react";
import { View, FlatList } from "react-native";
import { connectInfiniteHits } from "react-instantsearch-native";
import { SearchContentSummary } from "../Search/SearchContentSummary";
import { theme } from "../../theme"

interface Props {
  hits: any[];
  hasMore: boolean;
  refineNext: any;
  navigation: any;
  callbackCloseModal: any;
  selectedLanguage: string|null;
}

const getLanguageMatch = (hit: any, selectedLanguage: string) => {
  const props = Object.keys(hit._highlightResult);
  for (const prop of props) {
    if (hit._highlightResult[prop].matchLevel === "full") {
      return prop.split("_")[1];
    }
  }
  return selectedLanguage;
}

const InfiniteHits = ({ hits, hasMore, refineNext, navigation, callbackCloseModal, selectedLanguage }: Props) => {
  return (
    <FlatList
      data={hits}
      keyExtractor={item => item.objectID}
      onEndReached={() => hasMore && refineNext()}
      style={{ paddingTop: theme.margin * 2 }}
      contentContainerStyle={{ paddingBottom: theme.margin * 6 }}
      renderItem={({ item }) => {

        return (
          <View
            key={item.objectID}
            style={{
              flex: 1,
              marginBottom: theme.margin * 2,
              paddingHorizontal: theme.margin * 3
            }}
          >
            <SearchContentSummary
              navigation={navigation}
              item={item}
              callbackCloseModal={callbackCloseModal}
              languageMatch={getLanguageMatch(item, selectedLanguage || "fr")}
            />
          </View>
        )
      }}
    />
  )
}

export default connectInfiniteHits(InfiniteHits);