import React, { useEffect } from "react";
import { useSearchBox } from "react-instantsearch-core";
import { TextInput, type TextInputProps, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { styles } from "~/theme";
import { RTLView } from "../BasicComponents";

const MainContainer = styled.View`
  margin-horizontal: ${styles.margin * 3}px;
  flex-direction: row;
  align-items: center;
`;
const InputContainer = styled(RTLView)`
  height: 56px;
  width: 100%;
  border-radius: ${styles.radius * 2}px;
  padding: ${styles.margin * 2}px;
  background-color: ${styles.colors.white};
  border: 1px solid ${styles.colors.darkGrey};
  flex: 1;
`;

interface Props {
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
  backCallback: () => void;
}

const SearchBox: React.FC<Props> = ({ searchInputValue, setSearchInputValue, backCallback }) => {
  const input = React.useRef<TextInput>(null);
  const { t, isRTL } = useTranslationWithRTL();
  const { query, refine } = useSearchBox();

  const setQuery = (newQuery: string) => {
    setSearchInputValue(newQuery);
    refine(newQuery);
  };

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  // We bypass the state update if the input is focused to avoid concurrent
  // updates when typing.
  if (query !== searchInputValue && !input.current?.isFocused()) {
    setSearchInputValue(query);
  }

  useEffect(() => {
    // set focus when component mounts
    setTimeout(() => {
      if (input && input.current) input.current.focus();
    }, 500);
  }, []);

  const inputStyle = {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: styles.colors.black,
    marginLeft: isRTL ? 0 : styles.margin,
    marginRight: isRTL ? styles.margin : 0,
  };

  return (
    <MainContainer>
      <TouchableOpacity
        onPress={backCallback}
        style={{ marginRight: styles.margin }}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel={t("global.back")}
      >
        <Icon name="arrow-back-outline" height={24} width={24} fill={styles.colors.darkGrey} />
      </TouchableOpacity>
      <InputContainer>
        <Icon name="search-outline" height={24} width={24} fill={styles.colors.darkGrey} />
        <TextInput
          ref={input}
          style={inputStyle}
          onChangeText={setQuery}
          value={searchInputValue}
          placeholder={t("search_screen.search", "Rechercher")}
          placeholderTextColor={styles.colors.darkGrey}
          textAlign={isRTL ? "right" : "left"}
          testID="test-city-search"
        />
        <TouchableOpacity
          onPress={() => setQuery("")}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel={t("global.clear_selection_accessibility")}
        >
          <Icon name="close-outline" height={24} width={24} fill={styles.colors.darkGrey} />
        </TouchableOpacity>
      </InputContainer>
    </MainContainer>
  );
};

export default SearchBox;
