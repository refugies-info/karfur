import { StackScreenProps } from "@react-navigation/stack";
import algoliasearch from "algoliasearch/lite";
import * as React from "react";
import { Configure, InstantSearch } from "react-instantsearch-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import InfiniteHits from "~/components/Search/InfiniteHits";
import SearchBox from "~/components/Search/SearchBox";
import SearchSuggestions from "~/components/Search/SearchSuggestions";
import Config from "~/libs/getEnvironment";
import { getSearchableAttributes } from "~/libs/search";
import { mostViewedContentsSelector } from "~/services/redux/Contents/contents.selectors";
import { groupedContentsSelector } from "~/services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { needsSelector } from "~/services/redux/Needs/needs.selectors";
import { currentI18nCodeSelector } from "~/services/redux/User/user.selectors";
import { styles } from "~/theme";
import { SearchParamList } from "~/types/navigation";

const SearchBoxContainer = styled.View`
  padding-bottom: ${({ theme }) => theme.margin * 3}px;
  background-color: ${({ theme }) => theme.colors.lightGrey};
  ${({ theme }) => theme.shadows.xs};
`;

const searchClient = algoliasearch("L9HYT1676M", process.env.ALGOLIA_API_KEY || "");

export const SearchResultsScreen = ({ navigation }: StackScreenProps<SearchParamList, "SearchResultsScreen">) => {
  const insets = useSafeAreaInsets();
  const [searchState, setSearchState] = React.useState({ query: "" });
  const currentI18nCode = useSelector(currentI18nCodeSelector);
  const mostViewedContents = useSelector(mostViewedContentsSelector(currentI18nCode || "fr"));
  const groupedContents = useSelector(groupedContentsSelector);
  const allNeeds = useSelector(needsSelector);

  // Calculate nb contents per need
  const nbContents = React.useMemo(() => {
    const nbContents: Record<string, number> = {};
    for (const need of allNeeds) {
      nbContents[need._id.toString()] = groupedContents[need._id.toString()]?.length || 0;
    }
    return nbContents;
  }, []);

  // Search parameters
  const [searchableAttributes, setSearchableAttributes] = React.useState<string[]>([]);
  React.useEffect(() => {
    setSearchableAttributes(getSearchableAttributes(currentI18nCode));
  }, [currentI18nCode]);

  const queryLanguages: string[] = ["fr"];
  if (currentI18nCode && currentI18nCode !== "ti") {
    // ti not supported by Algolia
    queryLanguages.push(currentI18nCode);
  }
  const parentScrollview = React.useRef<ScrollView>(null);

  return (
    <View style={{ flex: 1 }}>
      <InstantSearch
        searchClient={searchClient}
        indexName={Config.algoliaIndex}
        searchState={searchState}
        onSearchStateChange={setSearchState}
      >
        <Configure
          restrictSearchableAttributes={searchableAttributes}
          queryLanguages={queryLanguages}
          clickAnalytics
          filters="webOnly:false"
          analyticsTags={[`ln_${currentI18nCode}`]}
        />
        <SearchBoxContainer style={{ paddingTop: insets.top + styles.margin * 3 }}>
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
            }}
          >
            <SearchSuggestions contents={mostViewedContents} navigation={navigation} />
          </ScrollView>
        )}
      </InstantSearch>
    </View>
  );
};
