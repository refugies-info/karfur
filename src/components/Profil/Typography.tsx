import {
  TextSmallNormal,
  TextBigBold,
  TextSmallBold,
  TextNormalBold,
} from "../../components/StyledText";
import styled from "styled-components/native";
import { styles } from "../../theme";

export const P = styled(TextSmallNormal)`
  margin-bottom: ${styles.margin * 3}px;
`;
export const H1 = styled(TextBigBold)`
  margin-bottom: ${styles.margin * 3}px;
  margin-top: ${styles.margin * 7}px;
`;
export const H2 = styled(TextNormalBold)`
  margin-bottom: ${styles.margin * 3}px;
`;
export const Link = styled(TextSmallBold)`
  text-decoration: underline;
`;