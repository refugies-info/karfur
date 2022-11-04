import styled from "styled-components/native";

export const RowContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

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
