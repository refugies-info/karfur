import React, { ReactNode } from "react";
import styled from "styled-components/native";

const CardContainer = styled.View<{ backgroundColor: string; shadow: boolean }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  overflow: hidden;
  ${({ shadow, theme }) => (shadow ? theme.shadows.lg : "")};
`;

export interface CardProps {
  backgroundColor: string;
  children: ReactNode;
  shadow?: boolean;
}

const Card = ({ backgroundColor, children, shadow = false }: CardProps) => {
  return (
    <CardContainer backgroundColor={backgroundColor} shadow={shadow}>
      {children}
    </CardContainer>
  );
};

export default Card;
