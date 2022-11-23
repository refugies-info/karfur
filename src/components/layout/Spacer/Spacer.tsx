import styled from "styled-components/native";

export interface SpacerProps {
  height: number;
}

const Spacer = styled.View<SpacerProps>`
  min-height: ${({ height }) => height}px;
`;

export default Spacer;
