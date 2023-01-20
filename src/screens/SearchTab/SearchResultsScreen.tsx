import * as React from "react";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InstantSearch, Configure } from "react-instantsearch-native";
import { StackScreenProps } from "@react-navigation/stack";
import algoliasearch from "algoliasearch/lite";
import { SearchParamList } from "../../../types";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { mostViewedContentsSelector } from "../../services/redux/Contents/contents.selectors";
import { needsSelector } from "../../services/redux/Needs/needs.selectors";
import { groupedContentsSelector } from "../../services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import SearchBox from "../../components/Search/SearchBox";
import InfiniteHits from "../../components/Search/InfiniteHits";
import SearchSuggestions from "../../components/Search/SearchSuggestions";
import { getSearchableAttributes } from "../../libs/search";
import Config from "../../libs/getEnvironment";
import { styles } from "../../theme";

const SearchBoxContainer = styled.View`
  padding-bottom: ${styles.margin * 3}px;
  ${styles.shadows.xs}
  background-color: ${styles.colors.lightGrey};
`;

const searchClient = algoliasearch(
  "L9HYT1676M",
  process.env.ALGOLIA_API_KEY || ""
);

export const SearchResultsScreen = ({
  navigation,
}: StackScreenProps<SearchParamList, "SearchResultsScreen">) => {
  const insets = useSafeAreaInsets();
  const [searchState, setSearchState] = React.useState({ query: "" });
  const currentI18nCode = useSelector(currentI18nCodeSelector);
  const mostViewedContents = useSelector(
    mostViewedContentsSelector(currentI18nCode || "fr")
  );
  const groupedContents = useSelector(groupedContentsSelector);
  const allNeeds = useSelector(needsSelector);

  // Calculate nb contents per need
  const nbContents = React.useMemo(() => {
    const nbContents: any = {};
    for (const need of allNeeds) {
      nbContents[need._id] = groupedContents[need._id]?.length || 0;
    }
    return nbContents;
  }, []);

  // Search parameters
  const [searchableAttributes, setSearchableAttributes] = React.useState<
    string[]
  >([]);
  React.useEffect(() => {
    setSearchableAttributes(getSearchableAttributes(currentI18nCode));
  }, [currentI18nCode]);

  const queryLanguages: string[] = ["fr"];
  if (currentI18nCode && currentI18nCode !== "ti") {
    // ti no supported by Algolia
    queryLanguages.push(currentI18nCode);
  }
  const parentScrollview = React.useRef<ScrollView>(null);

  return (
    <View style={{ flex: 1 }}>
      <InstantSearch
        searchClient={searchClient}
        indexName={Config.algoliaIndex}
        searchState={searchState}
        onSearchStateChange={setSearchState}>
        <Configure
          restrictSearchableAttributes={searchableAttributes}
          queryLanguages={queryLanguages}
          clickAnalytics
          filters="webOnly:false"
        />
        <SearchBoxContainer
          style={{ paddingTop: insets.top + styles.margin * 3 }}>
          <SearchBox backCallback={() => navigation.navigate("SearchScreen")} />
        </SearchBoxContainer>
        {searchState.query !== "" ? (
          <View style={{ paddingBottom: insets.bottom + 100 }}>
            <InfiniteHits
              navigation={navigation}
              selectedLanguage={currentI18nCode}
              query={searchState.query}
              nbContents={nbContents}
            />
          </View>
        ) : (
          <ScrollView
            ref={parentScrollview}
            style={{ flex: 1 }}
            scrollEventThrottle={20}
            contentContainerStyle={{
              paddingBottom: styles.margin * 5 + (insets.bottom || 0),
              paddingHorizontal: styles.margin * 3,
            }}>
            <SearchSuggestions
              contents={mostViewedContents}
              navigation={navigation}
            />
          </ScrollView>
        )}
      </InstantSearch>
    </View>
  );
};
