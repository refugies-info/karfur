import styled from "styled-components/native";

const Content = styled.View`
  padding: ${({ theme }) => theme.layout.content.normal};
`;

Content.displayName = "Content";

export default Content;
