import {
  TextDSFR_MD,
  TextDSFR_MD_Bold,
  TextDSFR_XL,
  TextDSFR_L_Bold,
} from "../../components/StyledText";
import styled from "styled-components/native";
import { styles } from "../../theme";

export const P = styled(TextDSFR_MD)`
  margin-bottom: ${styles.margin * 3}px;
`;
export const H1 = styled(TextDSFR_XL)`
  margin-bottom: ${styles.margin * 5}px;
`;
export const H2 = styled(TextDSFR_L_Bold)`
  margin-bottom: ${styles.margin * 3}px;
`;
export const Link = styled(TextDSFR_MD_Bold)`
  text-decoration: underline;
`;
