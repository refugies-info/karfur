import * as React from "react";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack"
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { useSelector } from "react-redux";

import { SearchParamList } from "../../../types"
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useHeaderAnimation } from "../../hooks/useHeaderAnimation";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { contentsSelector, mostViewedContentsSelector } from "../../services/redux/Contents/contents.selectors";
import { RTLTouchableOpacity } from "../../components/BasicComponents";
import { HeaderAnimated } from "../../components/HeaderAnimated";
import SearchSuggestions from "../../components/Search/SearchSuggestions";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
import { styles } from "../../theme";
import { useVoiceover } from "../../hooks/useVoiceover";
import { ScrollView } from "react-native-gesture-handler";

const FakeInput = styled(RTLTouchableOpacity)`
  height:56px;
  width 100%;
  border-radius:${styles.radius * 2}px;
  padding:${styles.margin * 2}px;
  background-color: ${styles.colors.white};
  border: 1px solid ${styles.colors.darkGrey};
  margin-horizontal: ${styles.margin * 3}px;
  justify-content: flex-start;
  align-items: center;
`;
const FakeInputText = styled.Text`
  color: ${styles.colors.darkGrey};
  margin-left: ${(props: { isRTL: boolean }) => (props.isRTL ? 0 : styles.margin)}px;
  margin-right: ${(props: { isRTL: boolean }) => (props.isRTL ? styles.margin : 0)}px;
`;
const ShadowView = styled.View`
  background-color: ${styles.colors.lightGrey};
  padding-bottom: ${styles.margin * 2}px;
  z-index: 4;
  ${(props: { showShadow: boolean }) =>
    props.showShadow ? styles.shadows.xs : ""}
`;

export const SearchScreen = ({
  navigation
}: StackScreenProps<SearchParamList, "SearchScreen">) => {
  const { t, isRTL } = useTranslationWithRTL();
  const currentI18nCode = useSelector(currentI18nCodeSelector);
  const mostViewedContents = useSelector(mostViewedContentsSelector(currentI18nCode || "fr"));

  // Language modal
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );
  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  const { handleScroll, showSimplifiedHeader } = useHeaderAnimation();

  // Voiceover
  const parentScrollview = React.useRef<ScrollView>(null);
  const offset = 350;
  const {setScroll, saveList} = useVoiceover(parentScrollview, offset);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScroll(event.nativeEvent.contentOffset.y, offset);
  }

  const contents = useSelector(contentsSelector);
  React.useEffect(() => {
    if (contents.length) {
      setTimeout(saveList);
    }
  }, [contents])

  return (
    <View style={{ flex: 1 }}>
      <ShadowView showShadow={showSimplifiedHeader}>
        <HeaderAnimated
          title={t("tab_bar.search", "Rechercher")}
          showSimplifiedHeader={showSimplifiedHeader}
          onLongPressSwitchLanguage={toggleLanguageModal}
          extraHeight={styles.margin * 3}
        />

        <FakeInput
          onPress={() => navigation.navigate("SearchResultsScreen")}
          accessibilityRole="button"
        >
          <Icon
            name="search-outline"
            height={24}
            width={24}
            fill={styles.colors.darkGrey}
          />
          <FakeInputText isRTL={isRTL}>
            {t("search_screen.search", "Rechercher")}
          </FakeInputText>
        </FakeInput>
      </ShadowView>

      <SearchSuggestions
        handleScroll={handleScroll}
        contents={mostViewedContents}
        navigation={navigation}
        parentScrollview={parentScrollview}
        onScrollEnd={onScrollEnd}
      />
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
