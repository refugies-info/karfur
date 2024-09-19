import React, { useMemo } from "react";
import { connectInfiniteHits } from "react-instantsearch-native";
import { FlatList, Keyboard, Platform, View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { contentsSelector } from "~/services/redux/Contents/contents.selectors";
import { groupedContentsSelector } from "~/services/redux/ContentsGroupedByNeeds/contentsGroupedByNeeds.selectors";
import { styles } from "~/theme";
import { ErrorScreen } from "../ErrorScreen";
import { HitWithInsights } from "./Hit";
import NbResults from "./NbResults";

const ErrorContainer = styled.View`
  justify-content: center;
  flex-grow: 1;
`;

interface Props {
  hits: any[];
  hasMore: boolean;
  refineNext: any;
  navigation: any;
  selectedLanguage: string | null;
  query: string;
  nbContents: Record<string, number>;
}

const InfiniteHits = ({ hits, hasMore, refineNext, navigation, selectedLanguage, query, nbContents }: Props) => {
  const { t } = useTranslationWithRTL();
  const dismissMode: "on-drag" | "none" = "on-drag";
  const keyboardDismissProp =
    Platform.OS === "ios" ? { keyboardDismissMode: dismissMode } : { onScrollBeginDrag: Keyboard.dismiss };

  const contents = useSelector(contentsSelector);
  const contentIds = useMemo(() => contents.map((c) => c._id.toString()), [contents]);
  const groupedContents = useSelector(groupedContentsSelector);

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
          text={t("search_screen.try_new_search", "Essaie encore, vérifie l’orthographe ou utilise un autre mot-clé.")}
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
        onEndReached={() => hasMore && refineNext()}
        contentContainerStyle={{ paddingBottom: styles.margin * 6 }}
        {...keyboardDismissProp}
        ListHeaderComponent={<NbResults nbResults={nbResults} />}
        renderItem={({ item }) => (
          <HitWithInsights
            hit={item}
            navigation={navigation}
            selectedLanguage={selectedLanguage}
            nbContents={nbContents}
          />
        )}
      />
    </View>
  );
};

export default connectInfiniteHits(InfiniteHits);
