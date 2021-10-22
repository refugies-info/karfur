import styled from "styled-components/native";
import { TextBigBold, TextVerySmallBold } from "../../components/StyledText";
import { theme } from "../../theme";

export const Title = styled(TextBigBold)`
  margin-bottom: ${theme.margin * 2}px;
`;

export const Label = styled(TextVerySmallBold)`
  text-transform: uppercase;
  margin-bottom: ${theme.margin * 2}px;
`;

export const ContentContainer = styled.View`
  padding: ${theme.margin * 3}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;
