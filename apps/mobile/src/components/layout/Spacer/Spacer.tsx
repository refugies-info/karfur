import styled from "styled-components/native";

export interface SpacerProps {
  height?: number;
  width?: number;
}

const Spacer = styled.View<SpacerProps>`
  ${({ height }) => height && `min-height: ${height}px`};
  ${({ width }) => width && `min-width: ${width}px`};
`;

export default Spacer;
