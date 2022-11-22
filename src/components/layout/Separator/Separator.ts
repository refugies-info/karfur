import styled from "styled-components/native";

const Separator = styled.View`
  height: 1px;
  width: 90%;
  align-self: center;
  background-color: ${({ theme }) => theme.colors.grey};
  margin-vertical: ${({ theme }) => theme.margin / 2}px;
`;

export default Separator;
