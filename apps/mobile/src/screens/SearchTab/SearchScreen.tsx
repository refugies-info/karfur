import { useSelector } from "react-redux";
import { Page } from "~/components";
import HeaderContentSearch from "~/components/layout/Header/HeaderContentSearch";
import SearchSuggestions, { type NavigationProp } from "~/components/Search/SearchSuggestions";
import { mostViewedContentsSelector } from "~/services/redux/Contents/contents.selectors";
import { currentI18nCodeSelector } from "~/services/redux/User/user.selectors";

interface Props {
  navigation: NavigationProp;
}

export const SearchScreen = ({ navigation }: Props) => {
  const currentI18nCode = useSelector(currentI18nCodeSelector);
  const mostViewedContents = useSelector(mostViewedContentsSelector(currentI18nCode || "fr"));

  return (
    <Page hideBack HeaderContent={HeaderContentSearch} HeaderComponent={HeaderContentSearch}>
      <SearchSuggestions contents={mostViewedContents} navigation={navigation} />
    </Page>
  );
};
