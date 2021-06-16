import React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { GoogleAPISuggestion } from "../../../types";
import { StyledTextSmall } from "../StyledText";
import { RTLTouchableOpacity } from "../BasicComponents";
import { View } from "react-native";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

const StyledInput = styled.TextInput`
 height:56px;
 width 100%;
 border: 1px solid ${theme.colors.darkGrey};
 border-radius:${theme.radius * 2}px;
 padding:${theme.margin * 2}px;
 background-color : ${theme.colors.white}
`;

const SuggestionsContainer = styled.ScrollView`
  background-color: ${theme.colors.white};
  margin-top: ${theme.margin}px;
  max-height: 140px;
`;

const SuggestionContainer = styled(RTLTouchableOpacity)`
  padding: ${theme.margin * 2}px;
`;

const Separator = styled.View`
  height: 1px;
  background-color: ${theme.colors.grey60};
  margin-horizontal: ${theme.margin * 2}px;
`;

interface Props {
  enteredText: string;
  suggestions: GoogleAPISuggestion[];
  onChangeText: (data: string) => void;
  selectSuggestion: (suggestion: GoogleAPISuggestion) => void;
}

export const SearchBarCity = (props: Props) => {
  const { t } = useTranslationWithRTL();
  return (
    <View>
      <StyledInput
        value={props.enteredText}
        placeholder={t("Onboarding.placeholder", "Exemple : Paris")}
        onChangeText={props.onChangeText}
      />
      {props.suggestions.length > 0 && (
        <SuggestionsContainer keyboardShouldPersistTaps={"handled"}>
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
    </View>
  );
};
