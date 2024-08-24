import styled from "styled-components/native";

const ScrollableContent = styled.ScrollView<{ noMargin?: boolean }>`
  padding-bottom: ${({ noMargin, theme }) =>
    noMargin ? "0" : theme.layout.content.normal};
`;

export default ScrollableContent;
