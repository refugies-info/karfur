import React from "react";
import styled from "styled-components";
import { Language } from "../../../../types/interface";
import "./SubComponents.scss";

interface Props {
  language: Language;
  isSelected: boolean;
  hasMultipleLanguages: boolean;
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 16px;
  margin-bottom: 20px;
  align-items: center;
  cursor: ${(props) => (props.hasMultipleLanguages ? "pointer" : "default")};
`;

const Title = styled.div`
  font-weight: bold;
  font-size: ${(props) => (props.isSelected ? "28px" : "16px")};
  line-height: ${(props) => (props.isSelected ? "35px" : "20px")};
  text-decoration-line: ${(props) =>
    props.isSelected && props.hasMultipleLanguages ? "underline" : "none"};
`;
export const LanguageTitle = (props: Props) => (
  <MainContainer
    className="language-title"
    hasMultipleLanguages={props.hasMultipleLanguages}
  >
    {props.isSelected ? (
      <i
        className={
          "flag-icon flag-icon-" + props.language.langueCode + " selected"
        }
        title={props.language.langueCode}
        id={props.language.langueCode}
      />
    ) : (
      <i
        className={"flag-icon flag-icon-" + props.language.langueCode}
        title={props.language.langueCode}
        id={props.language.langueCode}
      />
    )}
    <Title
      isSelected={props.isSelected}
      hasMultipleLanguages={props.hasMultipleLanguages}
    >
      {props.language.langueFr}
    </Title>
  </MainContainer>
);
