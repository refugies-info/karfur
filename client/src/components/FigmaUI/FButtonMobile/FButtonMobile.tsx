import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { colors } from "colors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import i18n from "i18n";

interface Props {
  name: string;
  fill: string;
  title: string;
  defaultTitle: string;
  color: string;
  isDisabled: boolean;
  onClick: (e: any) => void;
}

const ButtonContainer = styled.div`
  display:flex;
  width: 100%;
  justify-content:center;
  padding:20px
  text-align: center;
  border-radius: 12px;
  margin: auto;
  align-items:center;
  background-color: ${(props) =>
    props.isDisabled ? colors.grey : props.backgroundColor};
  font-size:16px;
  color:${(props) => props.color};
  font-weight:700;
  cursor:pointer;
`;

const IconContainer = styled.div`
  margin-right: ${(props) => (props.isRTL ? "0px" : "10px")};
  margin-left: ${(props) => (props.isRTL ? "10px" : "0px")};
`;

export const FButtonMobile = (props: Props) => {
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
  const { t } = useTranslation();

  return (
    <ButtonContainer
      onClick={props.isDisabled ? null : props.onClick}
      isDisabled={props.isDisabled}
      backgroundColor={props.color}
      color={props.fill}
    >
      <IconContainer isRTL={isRTL}>
        <EVAIcon name={props.name} fill={props.fill} size={"large"} />
      </IconContainer>

      {t(props.title, props.defaultTitle)}
    </ButtonContainer>
  );
};
