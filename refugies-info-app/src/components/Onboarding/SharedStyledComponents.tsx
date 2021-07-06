import styled from "styled-components/native";
import { TextNormalBold } from "../../components/StyledText";
import { theme } from "../../theme";

export const Title = styled(TextNormalBold)`
  margin-top: ${theme.margin * 2}px;
  margin-bottom: ${theme.margin * 4}px;
`;

export const ContentContainer = styled.View`
  padding: ${theme.margin * 3}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;
