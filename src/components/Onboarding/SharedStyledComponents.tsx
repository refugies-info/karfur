import styled from "styled-components/native";
import { TextBigBold, TextVerySmallBold } from "../../components/StyledText";
import { styles } from "../../theme";

export const Title = styled(TextBigBold)`
  margin-bottom: ${styles.margin * 2}px;
`;

export const Label = styled(TextVerySmallBold)`
  text-transform: uppercase;
  margin-bottom: ${styles.margin * 2}px;
`;

export const ContentContainer = styled.View`
  padding: ${styles.margin * 3}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;
