import * as React from "react";
import { ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack"
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";

import { RTLTouchableOpacity } from "../../components/BasicComponents";
import { SearchParamList } from "../../../types"
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { HeaderAnimated } from "../../components/HeaderAnimated";
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

export const SearchScreen = ({
  navigation
}:StackScreenProps<SearchParamList, "SearchScreen">) => {
  const { t, isRTL } = useTranslationWithRTL();

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

      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </ScrollView>
  );
};
