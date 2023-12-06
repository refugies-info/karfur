import React, { useState, useRef } from "react";
import { View, TextInput, TouchableOpacity, PixelRatio } from "react-native";
import styled from "styled-components/native";
import { Icon } from "react-native-eva-icons";
import { styles } from "../../theme";
import { GoogleAPISuggestion } from "../../../types";
import { StyledTextSmall } from "../StyledText";
import { RTLTouchableOpacity, RTLView } from "../BasicComponents";
import Modal from "react-native-modal";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { SafeAreaView } from "react-native-safe-area-context";

const MainContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const InputContainer = styled(RTLView)`
  min-height:56px;
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
const FakeInput = styled(RTLTouchableOpacity)`
  min-height:56px;
  width 100%;
  border-radius:${styles.radius * 2}px;
  padding:${styles.margin * 2}px;
  background-color: ${styles.colors.white};
  border: 1px solid ${styles.colors.darkGrey};
  justify-content: flex-start;
  align-items: center;
`;
const FakeInputText = styled.Text`
  color: ${styles.colors.darkGrey};
  margin-left: ${(props: { isRTL: boolean }) =>
    props.isRTL ? 0 : styles.margin}px;
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? styles.margin : 0}px;
`;
const SuggestionsContainer = styled.ScrollView`
  margin-top: ${styles.margin}px;
`;
const SuggestionContainer = styled(RTLTouchableOpacity)`
  padding: ${styles.margin * 2}px;
`;
const Separator = styled.View`
  height: 1px;
  background-color: ${styles.colors.grey60};
  margin-horizontal: ${styles.margin * 2}px;
`;
const TextModal = styled(Modal)`
  justify-content: flex-start;
  padding-top: ${styles.margin * 6}px;
`;

interface Props {
  enteredText: string;
  suggestions: GoogleAPISuggestion[];
  onChangeText: (data: string) => void;
  selectSuggestion: (suggestion: GoogleAPISuggestion) => void;
}

export const SearchBarCity = (props: Props) => {
  const input = useRef<TextInput>();
  const [modalOpened, setModalOpened] = useState(false);
  const { t, isRTL } = useTranslationWithRTL();

  React.useEffect(() => {
    setTimeout(() => {
      if (input && input.current) input.current.focus();
    }, 100);
  }, [modalOpened]);

  const clearInput = () => props.onChangeText("");

  return (
    <View>
      <FakeInput
        onPress={() => setModalOpened(true)}
        accessibilityRole="button"
        accessibilityLabel={t("onboarding_screens.city_label", "Ta ville")}
      >
        <Icon
          name="search-outline"
          height={24}
          width={24}
          fill={styles.colors.darkGrey}
        />
        <FakeInputText isRTL={isRTL}>
          {t("onboarding_screens.placeholder", "Exemple : Paris")}
        </FakeInputText>
      </FakeInput>

      <TextModal
        isVisible={modalOpened}
        onBackdropPress={() => setModalOpened(false)}
        statusBarTranslucent={true}
        backdropColor={styles.colors.greyF7}
        backdropOpacity={1}
      >
        <SafeAreaView>
          <MainContainer>
            <TouchableOpacity
              onPress={() => setModalOpened(false)}
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
                value={props.enteredText}
                placeholder={t(
                  "onboarding_screens.placeholder",
                  "Exemple : Paris"
                )}
                placeholderTextColor={styles.colors.darkGrey}
                onChangeText={props.onChangeText}
                isRTL={isRTL}
                testID="test-city-input"
              />
              <TouchableOpacity
                onPress={clearInput}
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
          {props.suggestions.length > 0 && (
            <SuggestionsContainer
              keyboardShouldPersistTaps={"handled"}
              keyboardDismissMode="on-drag"
            >
              {props.suggestions.map((suggestion, index) => (
                <View key={suggestion.place_id}>
                  <SuggestionContainer
                    onPress={() => props.selectSuggestion(suggestion)}
                    accessibilityRole="button"
                  >
                    <StyledTextSmall>
                      {suggestion &&
                        suggestion.structured_formatting &&
                        suggestion.structured_formatting.main_text}
                    </StyledTextSmall>
                  </SuggestionContainer>
                  {index !== props.suggestions.length - 1 && <Separator />}
                </View>
              ))}
            </SuggestionsContainer>
          )}
        </SafeAreaView>
      </TextModal>
    </View>
  );
};
