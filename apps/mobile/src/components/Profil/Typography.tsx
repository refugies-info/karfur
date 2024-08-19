import styled from "styled-components/native";
import {
  TextDSFR_MD,
  TextDSFR_MD_Bold,
  TextDSFR_XL,
  TextDSFR_Chapo_Bold,
} from "../../components/StyledText";
import { styles } from "../../theme";

export const P = styled(TextDSFR_MD)`
  margin-bottom: ${styles.margin * 3}px;
`;
export const H1 = styled(TextDSFR_XL)<{ blue?: boolean }>`
  margin-bottom: ${styles.margin * 5}px;
  ${({ blue, theme }) => (!!blue ? `color: ${theme.colors.dsfr_action};` : "")}
`;
export const H2 = styled(TextDSFR_Chapo_Bold)`
  margin-bottom: ${styles.margin * 2}px;
  color: ${({ theme }) => theme.colors.dsfr_blueActive};
`;
export const Link = styled(TextDSFR_MD_Bold)`
  text-decoration: underline;
`;
