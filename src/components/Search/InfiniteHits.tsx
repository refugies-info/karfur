import React from "react";
import styled from "styled-components/native";
import { View, FlatList, Platform, Keyboard, Text } from "react-native";
import { connectInfiniteHits } from "react-instantsearch-native";
import { ErrorScreen } from "../ErrorScreen";
import NbResults from "./NbResults";
import { styles } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { HitWithInsights } from "./Hit";

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
  nbContents: any;
}

const InfiniteHits = ({
  hits,
  hasMore,
  refineNext,
  navigation,
  selectedLanguage,
  query,
  nbContents,
}: Props) => {
  const { t } = useTranslationWithRTL();
  const dismissMode: "on-drag" | "none" = "on-drag";
  const keyboardDismissProp =
    Platform.OS === "ios"
      ? { keyboardDismissMode: dismissMode }
      : { onScrollBeginDrag: Keyboard.dismiss };

  if (hits.length === 0) {
    return (
      <ErrorContainer>
        <ErrorScreen
          title={t("search_screen.no_result", "Impossible de trouver", {
            search: query,
          })}
          text={t(
            "search_screen.try_new_search",
            "Essaie encore, vérifie l’orthographe ou utilise un autre mot-clé."
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
        onEndReached={() => hasMore && refineNext()}
        contentContainerStyle={{ paddingBottom: styles.margin * 6 }}
        {...keyboardDismissProp}
        ListHeaderComponent={<NbResults />}
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
