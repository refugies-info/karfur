import styled from "styled-components";
import React from "react";
import { colors } from "colors";

const CategoryContainer = styled.div`
  border-radius: 12px;
  padding: 8px;
  background-color: ${(props: {isSelected: boolean}) =>
    props.isSelected ? colors.vert : colors.white};
  width: fit-content;
  margin: 4px;
  cursor: pointer;
  color: ${(props: {isSelected: boolean}) =>
    props.isSelected ? colors.white : colors.gray90};
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
