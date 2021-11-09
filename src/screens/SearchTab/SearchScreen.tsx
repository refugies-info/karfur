import * as React from "react";
import { View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack"
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { useSelector } from "react-redux";

import { SearchParamList } from "../../../types"
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { currentI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { mostViewedContentsSelector } from "../../services/redux/Contents/contents.selectors";
import { RTLTouchableOpacity } from "../../components/BasicComponents";
import { HeaderAnimated } from "../../components/HeaderAnimated";
import SearchSuggestions from "../../components/Search/SearchSuggestions";
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
import { theme } from "../../theme";

const FakeInput = styled(RTLTouchableOpacity)`
  height:56px;
  width 100%;
  border-radius:${theme.radius * 2}px;
  padding:${theme.margin * 2}px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.darkGrey};
  margin-horizontal: ${theme.margin * 3}px;
  justify-content: flex-start;
  align-items: center;
`;
const FakeInputText = styled.Text`
  color: ${theme.colors.grey60};
  margin-left: ${(props: { isRTL: boolean }) => (props.isRTL ? 0 : theme.margin)}px;
  margin-right: ${(props: { isRTL: boolean }) => (props.isRTL ? theme.margin : 0)}px;
`;
const ShadowView = styled.View`
  background-color: ${theme.colors.lightGrey};
  padding-bottom: ${theme.margin * 2}px;
  z-index: 4;
  ${(props: { showShadow: boolean }) => (props.showShadow ? `
  box-shadow: 0px -1px 8px rgba(33, 33, 33, 0.08);
  elevation: 4;
  ` : "")}
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
    <View style={{ flex: 1 }}>
      <ShadowView showShadow={showSimplifiedHeader}>
        <HeaderAnimated
          title={t("tabBar.Search", "Rechercher")}
          showSimplifiedHeader={showSimplifiedHeader}
          onLongPressSwitchLanguage={toggleLanguageModal}
          extraHeight={theme.margin * 3}
        />

        <FakeInput onPress={() => navigation.navigate("SearchResultsScreen")}>
          <Icon
            name="search-outline"
            height={24}
            width={24}
            fill={theme.colors.darkGrey}
          />
          <FakeInputText isRTL={isRTL}>
            {t("SearchScreeen.Rechercher", "Rechercher")}
          </FakeInputText>
        </FakeInput>
      </ShadowView>

      <SearchSuggestions
        handleScroll={handleScroll}
        contents={mostViewedContents}
        navigation={navigation}
      />
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
