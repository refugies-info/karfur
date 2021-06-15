import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { GoogleAPISuggestion } from "../../../types";

const StyledInput = styled.TextInput`
 height:56px;
 width 100%;
 border: 1px solid ${theme.colors.darkGrey};
 border-radius:${theme.radius * 2}px;
 padding:${theme.margin * 2}px
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
      {props.suggestions.map((suggestion) => (
        <Text key={suggestion.place_id}>
          {suggestion.description +
            " - " +
            suggestion.structured_formatting.main_text}
        </Text>
      ))}
    </>
  );
};
