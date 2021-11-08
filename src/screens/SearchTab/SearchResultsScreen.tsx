import * as React from "react";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { View } from "react-native";
import { InstantSearch, Configure } from "react-instantsearch-native";
import { StackScreenProps } from "@react-navigation/stack"
import algoliasearch from "algoliasearch/lite";
import {
  selectedI18nCodeSelector,
} from "../../services/redux/User/user.selectors";
import { SearchParamList } from "../../../types"
import SearchBox from "../../components/Search/SearchBox";
import InfiniteHits from "../../components/Search/InfiniteHits";
import { getSearchableAttributes } from "../../libs/search";
import { theme } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SearchBoxContainer = styled.View`
  padding-bottom: ${theme.margin * 3}px;
  box-shadow: 0px -1px 8px rgba(33, 33, 33, 0.08);
  elevation: 4;
  background-color: ${theme.colors.lightGrey};
`;

const searchClient = algoliasearch("L9HYT1676M", "3cb0d298b348e76675f4166741a45599");

export const SearchResultsScreen = ({
  navigation
}:StackScreenProps<SearchParamList, "SearchResultsScreen">) => {
  const insets = useSafeAreaInsets();
  const [searchState, setSearchState] = React.useState({query: ""});

  // Search parameters
  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  const [searchableAttributes, setSearchableAttributes] = React.useState<string[]>([]);

  React.useEffect(() => {
    setSearchableAttributes(getSearchableAttributes(selectedLanguage));
  }, [selectedLanguage])

  return (
    <View style={{ paddingBottom: insets.bottom + 100, flex: 1 }}>
      <InstantSearch
        searchClient={searchClient}
        indexName="staging_refugies"
        searchState={searchState}
        onSearchStateChange={setSearchState}
      >
        <Configure
          restrictSearchableAttributes={searchableAttributes}
          queryLanguages={["fr", selectedLanguage]}
        />
        <SearchBoxContainer style={{ paddingTop: (insets.top + theme.margin * 3) }}>
          <SearchBox backCallback={() => navigation.navigate("SearchScreen")} />
        </SearchBoxContainer>
        {searchState.query !== "" &&
        <InfiniteHits
          navigation={navigation}
          selectedLanguage={selectedLanguage}
          query={searchState.query}
        />
        }
      </InstantSearch>
    </View>
  );
};
