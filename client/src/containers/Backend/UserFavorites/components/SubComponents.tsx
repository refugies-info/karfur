import styled from "styled-components";
import { colors } from "colors";

export const FavoritesContainer = styled.div`
  background: ${colors.lightGrey};
  border-radius: 12px;
  padding-top: 40px;
  padding-bottom: 40px;
  width: 1120px;
  height: fit-content;
`;

export const CardContainer = styled.div`
  width: 248px;
  height: 248px;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-right: 8px;
  margin-left: 8px;
  z-index: 0;
`;

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-right: 32px;
  margin-left: 32px;
`;
