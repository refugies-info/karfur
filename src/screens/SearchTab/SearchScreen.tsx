import * as React from "react";
import { ScrollView } from "react-native";
import { InstantSearch } from "react-instantsearch-native";
import { StackScreenProps } from "@react-navigation/stack"
import algoliasearch from "algoliasearch/lite";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import Modal from "react-native-modal";

import { RTLTouchableOpacity } from "../../components/BasicComponents";
import { BottomTabParamList } from "../../../types"
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import SearchBox from "../../components/Search/SearchBox";
import InfiniteHits from "../../components/Search/InfiniteHits";
import { HeaderAnimated } from "../../components/HeaderAnimated";
import { FixSafeAreaView } from "../../components/FixSafeAreaView";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
import { theme } from "../../theme";


const FakeInput = styled(RTLTouchableOpacity)`
  height:56px;
  width 100%;
  border-radius:${theme.radius * 2}px;
  padding:${theme.margin * 2}px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.darkGrey};
  margin-top: ${theme.margin * 4}px;
  margin-horizontal: ${theme.margin * 3}px;
  justify-content: flex-start;
  align-items: center;
`;
const FakeInputText = styled.Text`
  color: ${theme.colors.grey60};
  margin-left: ${(props: { isRTL: boolean }) => (props.isRTL ? 0 : theme.margin)}px;
  margin-right: ${(props: { isRTL: boolean }) => (props.isRTL ? theme.margin : 0)}px;
`;
const SearchModal = styled(Modal)`
  margin-horizontal: 0;
  justify-content: flex-start;
  padding-top: ${theme.margin * 6}px;
`;

const searchClient = algoliasearch("L9HYT1676M", "3cb0d298b348e76675f4166741a45599");

export const SearchScreen = ({
  navigation
}:StackScreenProps<BottomTabParamList, "Search">) => {
  const { t, isRTL } = useTranslationWithRTL();
  const [searchState, setSearchState] = React.useState({query: ""});
  const [modalOpened, setModalOpened] = React.useState(false);

  // Language modal
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );
  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);


  // Header animation
  const [showSimplifiedHeader, setShowSimplifiedHeader] = React.useState(false);
  const handleScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y > 5 && !showSimplifiedHeader) {
      setShowSimplifiedHeader(true);
      return;
    }
    if (event.nativeEvent.contentOffset.y < 5 && showSimplifiedHeader) {
      setShowSimplifiedHeader(false);
      return;
    }
    return;
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      onScroll={handleScroll}
      scrollEventThrottle={5}
    >
      <HeaderAnimated
        title={t("tabBar.Search", "Rechercher")}
        showSimplifiedHeader={showSimplifiedHeader}
        onLongPressSwitchLanguage={toggleLanguageModal}
      />

      <FakeInput onPress={() => setModalOpened(true)}>
        <Icon
          name="search-outline"
          height={24}
          width={24}
          fill={theme.colors.darkGrey}
        />
        <FakeInputText isRTL={isRTL}>
          Rechercher
        </FakeInputText>
      </FakeInput>

      <SearchModal
        isVisible={modalOpened}
        onBackdropPress={() => setModalOpened(false)}
        statusBarTranslucent={true}
        backdropColor={theme.colors.greyF7}
        backdropOpacity={1}
      >
        <FixSafeAreaView>
          <InstantSearch
            searchClient={searchClient}
            indexName="staging_refugies"
            searchState={searchState}
            onSearchStateChange={setSearchState}
          >
            <SearchBox backCallback={() => setModalOpened(false)} />
            {searchState.query !== "" &&
            <InfiniteHits
              navigation={navigation}
            />
            }
          </InstantSearch>
        </FixSafeAreaView>
      </SearchModal>

      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </ScrollView>
  );
};
