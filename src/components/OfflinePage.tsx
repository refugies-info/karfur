import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";

const MainContainer = styled.View`
  background-color: red;
  padding-horizontal: 30px;
  max-width: 100%;
  width: 100%;
  min-height: 100%;
  padding-top: 50px;
`;

const OfflinePage = () => {
  return (
    <MainContainer>
      <Text>Veuillez mettre à jour l'application</Text>
    </MainContainer>
  );
};

export default OfflinePage;
