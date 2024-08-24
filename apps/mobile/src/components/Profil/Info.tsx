import * as React from "react";
import styled, { useTheme } from "styled-components/native";
import { RTLView } from "../BasicComponents";
import { TextDSFR_MD } from "../StyledText";
import { Icon } from "../iconography";
import { useTranslationWithRTL } from "../../hooks";

const Container = styled(RTLView)`
  background-color: white;
  padding-vertical: ${({ theme }) => theme.margin * 1.5}px;
  padding-horizontal: ${({ theme }) => theme.margin}px;
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
  border: 1px solid ${({ theme }) => theme.colors.dsfr_borderGrey};
  align-items: flex-start;
`;

interface Props {
  text: string;
  icon: string;
}

export const Info = (props: Props) => {
  const { isRTL } = useTranslationWithRTL();
  const theme = useTheme();

  return (
    <Container>
      <Icon name={props.icon} size={24} color={theme.colors.black} />
      <TextDSFR_MD
        style={{
          marginRight: isRTL ? theme.margin : 0,
          marginLeft: !isRTL ? theme.margin : 0,
          flexShrink: 1,
        }}
      >
        {props.text}
      </TextDSFR_MD>
    </Container>
  );
};
