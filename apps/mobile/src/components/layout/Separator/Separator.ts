import styled from "styled-components/native";

export enum SeparatorSpacing {
  Default = "default",
  Small = "small",
  Large = "large",
  XLarge = "xlarge",
  NoSpace = "nospace",
}

const Separator = styled.View<{ fullWidth?: boolean; spacing?: SeparatorSpacing; color?: string }>`
  height: 1px;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "90%")};
  align-self: center;
  background-color: ${({ theme, color }) => color || theme.colors.grey};
  margin-vertical: ${({ theme, spacing }) => theme.layout.separator[spacing || SeparatorSpacing.Default]};
`;

export default Separator;
