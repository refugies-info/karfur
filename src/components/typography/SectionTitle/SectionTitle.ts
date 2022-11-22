import styled from "styled-components/native";
import { TextNormalBold } from "../../StyledText";

const SectionTitle = styled(TextNormalBold)`
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
`;

export default SectionTitle;
