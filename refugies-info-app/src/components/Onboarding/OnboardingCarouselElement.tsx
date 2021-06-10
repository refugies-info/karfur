import * as React from "react";

import styled from "styled-components/native";
import { Text } from "react-native";

interface Props {
  text: string;
  color: string;
}

const StyledView = styled.SafeAreaView`
  width: 100%;
  height: 100%;
  background-color: ${(props: { color: any }) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const OnboardingCarouselElement = (props: Props) => {
  return (
    <StyledView color={props.color}>
      <Text>{props.text}</Text>
    </StyledView>
  );
};
