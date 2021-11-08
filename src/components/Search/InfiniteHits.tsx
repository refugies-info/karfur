import React from "react";
import styled from "styled-components/native";
import { View, FlatList } from "react-native";
import { connectInfiniteHits } from "react-instantsearch-native";
import { SearchContentSummary } from "../Search/SearchContentSummary";
import { ErrorScreen } from "../ErrorScreen";
import { TextNormalBold } from "../StyledText";
import { theme } from "../../theme"
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const StyledTextBold = styled(TextNormalBold)`
  margin-top: ${theme.margin * 5}px;
  margin-bottom: ${theme.margin * 3}px;
  padding-horizontal: ${theme.margin * 3}px;
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

  if (hits.length === 0) {
    return (
      <View style={{ justifyContent: "center", flexGrow: 1 }}>
        <ErrorScreen
          title={t(
            "SearchScreen.Impossible de trouver",
            "Impossible de trouver"
          ) + `\n"${query}"`}
          text={t(
            "SearchScreen.Essaie une nouvelle recherche",
            "Essaie encore, vérifie l’orthographe ou utilise un autre mot-clé."
          )}
          imageLast={true}
        />
      </View>
    )
  }

  return (
    <View>
      <FlatList
        data={hits}
        keyExtractor={item => item.objectID}
        onEndReached={() => hasMore && refineNext()}
        contentContainerStyle={{ paddingBottom: theme.margin * 6 }}
        ListHeaderComponent={
          <StyledTextBold>{t("SearchScreen.résultats", "résultats", {nbResults: hits.length})}</StyledTextBold>
        }
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
                languageMatch={getLanguageMatch(item, selectedLanguage || "fr")}
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