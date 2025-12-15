import type { CompositeNavigationProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
import { useInfiniteHits } from "react-instantsearch-core";
import { FlatList, Keyboard, Platform, View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import type { SearchItem } from "~/components/Search/types";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { contentsSelector } from "~/services/redux/Contents/contents.selectors";
import { groupedContentsSelector } from "~/services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { styles } from "~/theme";
import type { ExplorerParamList, RootStackParamList } from "~/types/navigation";
import { ErrorScreen } from "../ErrorScreen";
import { type AlgoliaMetadata, HitWithInsights } from "./Hit";
import NbResults from "./NbResults";

const ErrorContainer = styled.View`
  justify-content: center;
  flex-grow: 1;
`;

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList>,
  StackNavigationProp<ExplorerParamList>
>;

interface Props {
  navigation: NavigationProp;
  selectedLanguage: string | null;
  query: string;
  nbContents: Record<string, number>;
}

const InfiniteHits = ({ navigation, selectedLanguage, query, nbContents }: Props) => {
  const { t } = useTranslationWithRTL();
  const dismissMode: "on-drag" | "none" = "on-drag";
  const keyboardDismissProp =
    Platform.OS === "ios"
      ? { keyboardDismissMode: dismissMode }
      : { onScrollBeginDrag: Keyboard.dismiss };

  const contents = useSelector(contentsSelector);
  const contentIds = useMemo(() => contents.map((c) => c._id.toString()), [contents]);
  const groupedContents = useSelector(groupedContentsSelector);

  const { hits, isLastPage, showMore } = useInfiniteHits<SearchItem>();

  const nbResults = React.useMemo(() => {
    return (hits || []).filter((hit) => {
      if (hit.typeContenu === "theme") return true;
      if (hit.typeContenu === "besoin") {
        // hide empty needs
        if (groupedContents[hit.objectID] && groupedContents[hit.objectID].length > 0) {
          return true;
        }
        return false;
      }
      // hide server side filtered dispositifs
      if (contentIds.includes(hit.objectID)) return true;
      return false;
    }).length;
  }, [contentIds, hits]);

  if (nbResults === 0) {
    return (
      <ErrorContainer>
        <ErrorScreen
          title={t("search_screen.no_result", "Impossible de trouver", {
            search: query,
          })}
          text={t(
            "search_screen.try_new_search",
            "Essaie encore, vérifie l’orthographe ou utilise un autre mot-clé.",
          )}
          imageLast={true}
        />
      </ErrorContainer>
    );
  }

  return (
    <View>
      <FlatList
        data={hits}
        keyExtractor={(item) => item.objectID}
        onEndReached={() => !isLastPage && showMore()}
        contentContainerStyle={{ paddingBottom: styles.margin * 6 }}
        {...keyboardDismissProp}
        ListHeaderComponent={<NbResults nbResults={nbResults} />}
        renderItem={({ item, index }) => {
          if (!item._highlightResult) {
            return null;
          }
          return (
            <HitWithInsights
              hit={{ ...item, __index: index.toString() } as SearchItem & AlgoliaMetadata}
              navigation={navigation}
              selectedLanguage={selectedLanguage}
              nbContents={nbContents}
            />
          );
        }}
      />
    </View>
  );
};

export default InfiniteHits;
