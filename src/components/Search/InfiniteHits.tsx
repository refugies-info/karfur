import React from "react";
import styled from "styled-components/native";
import { View, FlatList } from "react-native";
import { connectInfiniteHits } from "react-instantsearch-native";
import { SearchContentSummary } from "../Search/SearchContentSummary";
import { TextNormalBold } from "../StyledText";
import { theme } from "../../theme"

const StyledTextBold = styled(TextNormalBold)`
  margin-top: ${theme.margin * 8}px;
  margin-bottom: ${theme.margin * 3}px;
  padding-horizontal: ${theme.margin * 3}px;
`;

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
  const resultsNumber = <StyledTextBold>{hits.length} résultats</StyledTextBold>;

  return (
    <FlatList
      data={hits}
      keyExtractor={item => item.objectID}
      onEndReached={() => hasMore && refineNext()}
      contentContainerStyle={{ paddingBottom: theme.margin * 6 }}
      ListHeaderComponent={resultsNumber}
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