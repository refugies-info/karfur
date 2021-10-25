import React, { useState, useRef } from "react";
import { View, TextInput } from "react-native";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { GoogleAPISuggestion } from "../../../types";
import { StyledTextSmall } from "../StyledText";
import { RTLTouchableOpacity } from "../BasicComponents";
import Modal from "react-native-modal";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { FixSafeAreaView } from "../FixSafeAreaView";

const StyledInput = styled.TextInput`
 height:56px;
 width 100%;
 border-radius:${theme.radius * 2}px;
 padding:${theme.margin * 2}px;
 background-color : ${theme.colors.white};
 text-align :${(props: { isRTL: boolean }) => (props.isRTL ? "right" : "left")};
 border :${(props: { value: string; isFocused: boolean }) =>
   props.value || props.isFocused
     ? `2px solid ${theme.colors.blue}`
     : `1px solid ${theme.colors.darkGrey}`};
`;
const FakeInput = styled.TouchableOpacity`
  height:56px;
  width 100%;
  border-radius:${theme.radius * 2}px;
  padding:${theme.margin * 2}px;
  background-color: ${theme.colors.white};
  border : 1px solid ${theme.colors.darkGrey};
  justify-content: center;
`;
const FakeInputText = styled.Text`
  color: ${theme.colors.grey60};
`;
const SuggestionsContainer = styled.ScrollView`
  background-color: ${theme.colors.white};
  margin-top: ${theme.margin}px;
`;
const SuggestionContainer = styled(RTLTouchableOpacity)`
  padding: ${theme.margin * 2}px;
`;
const Separator = styled.View`
  height: 1px;
  background-color: ${theme.colors.grey60};
  margin-horizontal: ${theme.margin * 2}px;
`;
const TextModal = styled(Modal)`
  justify-content: flex-start;
  padding-top: ${theme.margin * 6}px;
`;

interface Props {
  enteredText: string;
  suggestions: GoogleAPISuggestion[];
  onChangeText: (data: string) => void;
  selectSuggestion: (suggestion: GoogleAPISuggestion) => void;
}

export const SearchBarCity = (props: Props) => {
  const input = useRef<TextInput>();
  const [isFocused, setIsFocused] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const { t, isRTL } = useTranslationWithRTL();

  React.useEffect(() => {
    setTimeout(() => {
      if (input && input.current) input.current.focus()
    }, 100);
  }, [modalOpened])

  return (
    <View>
      <FakeInput onPress={() => setModalOpened(true)}>
        <FakeInputText>{t("Onboarding.placeholder", "Exemple : Paris")}</FakeInputText>
      </FakeInput>

      <TextModal
        isVisible={modalOpened}
        onBackdropPress={() => setModalOpened(false)}
        statusBarTranslucent={true}
      >
        <FixSafeAreaView>
          <StyledInput
            ref={input}
            value={props.enteredText}
            placeholder={t("Onboarding.placeholder", "Exemple : Paris")}
            onChangeText={props.onChangeText}
            isRTL={isRTL}
            testID="test-city-input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            isFocused={isFocused}
          />
          {props.suggestions.length > 0 && (
            <SuggestionsContainer
              keyboardShouldPersistTaps={"handled"}
              keyboardDismissMode="on-drag"
            >
              {props.suggestions.map((suggestion, index) => (
                <View key={suggestion.place_id}>
                  <SuggestionContainer
                    onPress={() => props.selectSuggestion(suggestion)}
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
        </FixSafeAreaView>
      </TextModal>
    </View>
  );
};
