import * as React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import { SearchParamList } from "../../../types";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { mostViewedContentsSelector } from "../../services/redux/Contents/contents.selectors";
import SearchSuggestions from "../../components/Search/SearchSuggestions";
import { Page } from "../../components";
import HeaderContentSearch from "../../components/layout/Header/HeaderContentSearch";

export const SearchScreen = ({
  navigation,
}: StackScreenProps<SearchParamList, "SearchScreen">) => {
  const currentI18nCode = useSelector(currentI18nCodeSelector);
  const mostViewedContents = useSelector(
    mostViewedContentsSelector(currentI18nCode || "fr")
  );

  return (
    <Page
      hideBack
      HeaderContent={HeaderContentSearch}
      HeaderComponent={HeaderContentSearch}
    >
      <SearchSuggestions
        contents={mostViewedContents}
        navigation={navigation}
      />
    </Page>
  );
};
