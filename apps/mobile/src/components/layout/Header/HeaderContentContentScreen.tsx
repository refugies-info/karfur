import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  position: relative;
`;

const TitlesContainer = styled(View)`
  height: 40px;
`;

const HeaderContentContentScreen = () => {
  return (
    <Container>
      <TitlesContainer></TitlesContainer>
    </Container>
  );
};

export default HeaderContentContentScreen;
