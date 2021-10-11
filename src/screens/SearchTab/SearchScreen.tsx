import * as React from "react";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-native";
import SearchBox from "../../components/Search/SearchBox";
import InfiniteHits from "../../components/Search/InfiniteHits";

const searchClient = algoliasearch("L9HYT1676M", "3cb0d298b348e76675f4166741a45599");

export const SearchScreen = () => {

  const [searchState, setSearchState] = React.useState({});

  return (
    <WrapperWithHeaderAndLanguageModal>
      <InstantSearch
        searchClient={searchClient}
        indexName="staging_refugies"
        searchState={searchState}
        onSearchStateChange={setSearchState}
      >
        <SearchBox />
        <InfiniteHits />
      </InstantSearch>
    </WrapperWithHeaderAndLanguageModal>
  );
};

/* FORMATTING FOR INITIAL INDEXING
JSON.stringify(content.map(content  => ({
    objectID: content._id,
    titre: content.titreInformatif,
    titreMarque: content.titreMarque,
    type: content.typeContenu,
    tags: content.tags.map(t => t ? t.name : "").filter(t => t !== ""),
    tagsShort: content.tags.map(t => t ? t.short : "").filter(t => t !== ""),
    abstract: content.abstract
  })))
*/