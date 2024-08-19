import React from "react";
import styled from "styled-components/native";
import { View, FlatList, Platform, Keyboard } from "react-native";
import { connectInfiniteHits } from "react-instantsearch-native";
import { SearchContentSummary } from "../Search/SearchContentSummary";
import { ErrorScreen } from "../ErrorScreen";
import NbResults from "./NbResults";
import { styles } from "../../theme"
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const ErrorContainer = styled.View`
  justifyContent: center;
  flex-grow: 1;
`;

interface Props {
  hits: any[];
  hasMore: boolean;
  refineNext: any;
  navigation: any;
  selectedLanguage: string | null;
  query: string;
  nbContents: any;
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

const hasSponsorMatch = (hit: any) => hit._highlightResult?.sponsorName?.matchLevel === "full";

const InfiniteHits = ({
  hits,
  hasMore,
  refineNext,
  navigation,
  selectedLanguage,
  query,
  nbContents
}: Props) => {
  const { t } = useTranslationWithRTL();
  const dismissMode: "on-drag"|"none" = "on-drag";
  const keyboardDismissProp = Platform.OS === "ios" ?
    { keyboardDismissMode: dismissMode } :
    { onScrollBeginDrag: Keyboard.dismiss };

  if (hits.length === 0) {
    return (
      <ErrorContainer>
        <ErrorScreen
          title={t(
            "search_screen.no_result",
            "Impossible de trouver"
            , { search: query })}
          text={t(
            "search_screen.try_new_search",
            "Essaie encore, vérifie l’orthographe ou utilise un autre mot-clé."
          )}
          imageLast={true}
        />
      </ErrorContainer>
    )
  }

  return (
    <View>
      <FlatList
        data={hits}
        keyExtractor={item => item.objectID}
        onEndReached={() => hasMore && refineNext()}
        contentContainerStyle={{ paddingBottom: styles.margin * 6 }}
        {...keyboardDismissProp}
        ListHeaderComponent={<NbResults />}
        renderItem={({ item }) => {
          return (
            <View
              key={item.objectID}
              style={{
                flex: 1,
                marginBottom: styles.margin * 2,
                paddingHorizontal: styles.margin * 3
              }}
            >
              <SearchContentSummary
                navigation={navigation}
                item={item}
                languageMatch={getLanguageMatch(item, selectedLanguage || "fr")}
                hasSponsorMatch={hasSponsorMatch(item)}
                nbContents={item.typeContenu === "besoin" ? nbContents[item.objectID] : null}
              />
            </View>
          )
        }}
      />
    </View>
  )
}

export default connectInfiniteHits(InfiniteHits);