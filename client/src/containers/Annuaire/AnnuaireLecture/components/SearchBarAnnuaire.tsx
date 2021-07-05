import React from "react";
import styled from "styled-components";
import { colors } from "../../../../colors";
// import { NavHashLink } from "react-router-hash-link";
// import i18n from "../../../../i18n";

const HeaderContainer = styled.div`
  margin-top: 146px;
  margin-left: 77px;
  height: 74px;
  background-color: ${colors.bleuCharte};
  border-radius: 12px;
  padding: 12px;
`;

interface Props {
  text: any;
}

export const SearchBarAnnuaire = (props: Props) => {
  return <HeaderContainer>Hello {props.text}</HeaderContainer>;
};
