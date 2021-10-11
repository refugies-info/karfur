import React from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { connectSearchBox } from "react-instantsearch-native";
import { theme } from "../../theme";

const Input = styled.TextInput`
  height: 48px;
  padding: 12px;
  fontSize: 16px;
  backgroundColor: ${theme.colors.white};
  borderRadius: ${theme.radius * 2}px;
  shadow-color: #212121;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 40px;
  elevation: 1;
`;

interface Props {
  currentRefinement: string
  refine: any
}

const SearchBox = ({ currentRefinement, refine }: Props) => (
  <View style={{padding: 16}}>
    <Input
      onChangeText={(value: string) => refine(value)}
      value={currentRefinement}
    />
  </View>
);

export default connectSearchBox(SearchBox);