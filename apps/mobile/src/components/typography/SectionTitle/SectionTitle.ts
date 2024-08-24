import styled from "styled-components/native";
import { TextDSFR_L_Bold } from "../../StyledText";

const SectionTitle = styled(TextDSFR_L_Bold)`
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
`;

export default SectionTitle;
