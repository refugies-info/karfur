import styled from "styled-components/native";
import { TextDSFR_XL } from "../../StyledText";

const Title = styled(TextDSFR_XL)`
  margin-bottom: ${({ theme }) => theme.margin * 3}px;
`;

export default Title;
