import styled from "styled-components";
import React from "react";
import { colors } from "../../../../../colors";

const CategoryContainer = styled.div`
  border-radius: 12px;
  padding: 8px;
  background-color: ${(props) =>
    props.isSelected ? colors.vert : colors.blancSimple};
  width: fit-content;
  margin: 4px;
  cursor: pointer;
  color: ${(props) =>
    props.isSelected ? colors.blancSimple : colors.darkColor};
`;

interface Props {
  categorieName: string;
  isSelected: boolean;
  onClick: () => void;
}
export const Category = (props: Props) => (
  <CategoryContainer isSelected={props.isSelected} onClick={props.onClick}>
    {props.categorieName}
  </CategoryContainer>
);
