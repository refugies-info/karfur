import styled from "styled-components";
import { H2, H5 } from "../../components/UI/Typography/Typography";
import img from "../../assets/login_background.svg";
import { colors } from "colors";

export const StyledH2 = styled(H2)`
  margin-top: 64px;
`;
export const StyledH5 = styled(H5)`
  margin-top: 32px;
  margin-bottom: 16px;
`;

export const StyledEnterValue = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-top: 64px;
  margin-bottom: 16px;
`;

export const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  flex-direction: column;
  background-image: url(${img});
  background-color: #fbfbfb;
`;

export const ContentContainer = styled.div`
  padding-top: ${p => p.smallPadding ? 40 : 100}px;
`;
export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const FooterLinkContainer = styled.p`
  color: ${colors.grisFonce};
  font-size: 16px;
  line-height: 20px;
  margin-top: 64px;
`;

export const ErrorMessageContainer = styled.div`
  color: #e8140f;
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

export const NoEmailRelatedContainer = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: #e8140f;
  margin-top: 64px;
  margin-bottom: 64px;
`;

export const EmailRelatedContainer = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-top: 64px;
  margin-bottom: 16px;
`;

export const ResetPasswordMessage = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  margin-bottom: 16px;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
