import styled from "styled-components/native";
import {
  StyledTextBigBold,
  StyledTextSmall,
} from "../../components/StyledText";
import { styles } from "../../theme";

export const Title = styled(StyledTextBigBold)`
  margin-bottom: ${styles.margin * 2}px;
`;

export const Label = styled(StyledTextSmall)`
  margin-bottom: ${styles.margin}px;
`;

export const ContentContainer = styled.View`
  padding: ${styles.margin * 3}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;
