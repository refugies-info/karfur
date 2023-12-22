import styled from "styled-components/native";
import { TextBigBold } from "../../StyledText";

const Title = styled(TextBigBold)`
  margin-bottom: ${({ theme }) => theme.margin * 3}px;
`;

export default Title;
