import React from "react";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { GoogleAPISuggestion } from "../../../types";
import { StyledTextSmall } from "../StyledText";
import { RTLTouchableOpacity } from "../BasicComponents";

const StyledInput = styled.TextInput`
 height:56px;
 width 100%;
 border: 1px solid ${theme.colors.darkGrey};
 border-radius:${theme.radius * 2}px;
 padding:${theme.margin * 2}px
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
}

export const SearchBarCity = (props: Props) => {
  return (
    <>
      <StyledInput
        value={props.enteredText}
        placeholder={"Exemple : Paris"}
        onChangeText={props.onChangeText}
      />
      {props.suggestions.length > 0 && (
        <SuggestionsContainer>
          {props.suggestions.map((suggestion, index) => (
            <>
              <SuggestionContainer key={suggestion.place_id}>
                <StyledTextSmall>
                  {suggestion &&
                    suggestion.structured_formatting &&
                    suggestion.structured_formatting.main_text}
                </StyledTextSmall>
              </SuggestionContainer>
              {index !== props.suggestions.length - 1 && <Separator />}
            </>
          ))}
        </SuggestionsContainer>
      )}
    </>
  );
};
