import styled from "styled-components/native";

const RTLViewContainer = styled.View`
  display: flex;
  flex-direction: ${({ theme }) => (theme.i18n.isRTL ? "row-reverse" : "row")};
  align-items: center;
`;

const RTLTouchableOpacityContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: ${({ theme }) => (theme.i18n.isRTL ? "row-reverse" : "row")};
`;

export {
  RTLViewContainer as RTLView,
  RTLTouchableOpacityContainer as RTLTouchableOpacity,
};
