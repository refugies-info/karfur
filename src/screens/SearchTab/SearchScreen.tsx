import * as React from "react";
import { InstantSearch } from "react-instantsearch-native";
import { StackScreenProps } from "@react-navigation/stack"
import algoliasearch from "algoliasearch/lite";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import SearchBox from "../../components/Search/SearchBox";
import InfiniteHits from "../../components/Search/InfiniteHits";
import { BottomTabParamList } from "../../../types"

const searchClient = algoliasearch("L9HYT1676M", "3cb0d298b348e76675f4166741a45599");

export const SearchScreen = ({
  navigation
}:StackScreenProps<BottomTabParamList, "Search">) => {

  const [searchState, setSearchState] = React.useState({query: ""});

  return (
    <WrapperWithHeaderAndLanguageModal>
      <InstantSearch
        searchClient={searchClient}
        indexName="staging_refugies"
        searchState={searchState}
        onSearchStateChange={setSearchState}
      >
        <SearchBox />
        {searchState.query !== "" && <InfiniteHits navigation={navigation} />}
      </InstantSearch>
    </WrapperWithHeaderAndLanguageModal>
  );
};

/* FORMATTING FOR INITIAL INDEXING
JSON.stringify(content.map(content  => ({
    objectID: content._id,
    titreInformatif: content.titreInformatif,
    titreMarque: content.titreMarque,
    typeContenu: content.typeContenu,
    sponsorUrl: content.sponsorUrl,
    tags: content.tags.map(t => t ? t.name : "").filter(t => t !== ""),
    tagsShort: content.tags.map(t => t ? t.short : "").filter(t => t !== ""),
    abstract: content.abstract,
  })))
*/