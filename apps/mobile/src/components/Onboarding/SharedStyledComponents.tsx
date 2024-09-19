import styled from "styled-components/native";
import { TextDSFR_MD, TextDSFR_XL } from "~/components/StyledText";
import { styles } from "~/theme";

export const Title = styled(TextDSFR_XL)`
  margin-bottom: ${styles.margin * 2}px;
`;

export const Label = styled(TextDSFR_MD)`
  margin-bottom: ${styles.margin}px;
`;

export const ContentContainer = styled.View`
  padding: ${styles.margin * 3}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;
