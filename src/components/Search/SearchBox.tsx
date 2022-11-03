import React from "react";
import styled from "styled-components/native";
import { TouchableOpacity, TextInput } from "react-native";
import { connectSearchBox } from "react-instantsearch-native";
import { styles } from "../../theme";
import { RTLView } from "../BasicComponents";
import { Icon } from "react-native-eva-icons";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const MainContainer = styled.View`
  margin-horizontal: ${styles.margin * 3}px;
  flex-direction: row;
  align-items: center;
`;
const InputContainer = styled(RTLView)`
  height:56px;
  width 100%;
  border-radius:${styles.radius * 2}px;
  padding:${styles.margin * 2}px;
  background-color : ${styles.colors.white};
  border: 1px solid ${styles.colors.darkGrey};
  flex: 1;
`;
const StyledInput = styled.TextInput`
  height:100%;
  width 100%;
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
  text-align: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "right" : "left"};
  flex: 1;
`;

interface Props {
  currentRefinement: string;
  refine: any;
  backCallback: () => void;
}

const SearchBox = ({ currentRefinement, refine, backCallback }: Props) => {
  const input = React.useRef<TextInput>();
  const { t, isRTL } = useTranslationWithRTL();

  React.useEffect(() => {
    // set focus when component mounts
    setTimeout(() => {
      if (input && input.current) input.current.focus();
    }, 500);
  }, []);

  return (
    <MainContainer>
      <TouchableOpacity
        onPress={backCallback}
        style={{ marginRight: styles.margin }}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel={t("global.back")}
      >
        <Icon
          name="arrow-back-outline"
          height={24}
          width={24}
          fill={styles.colors.darkGrey}
        />
      </TouchableOpacity>
      <InputContainer>
        <Icon
          name="search-outline"
          height={24}
          width={24}
          fill={styles.colors.darkGrey}
        />
        <StyledInput
          // @ts-ignore
          ref={input}
          onChangeText={(value: string) => refine(value)}
          value={currentRefinement}
          placeholder={t("search_screen.search", "Rechercher")}
          placeholderTextColor={styles.colors.darkGrey}
          isRTL={isRTL}
          testID="test-city-search"
        />
        <TouchableOpacity
          onPress={() => refine("")}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel={t("global.clear_selection_accessibility")}
        >
          <Icon
            name="close-outline"
            height={24}
            width={24}
            fill={styles.colors.darkGrey}
          />
        </TouchableOpacity>
      </InputContainer>
    </MainContainer>
  );
};

export default connectSearchBox(SearchBox);
