import React from "react";
import styled from "styled-components";
// import Icon from "react-eva-icons";
declare const window: Window;

interface Props {
  name: string;
  onClick?: () => void;
  content?: { titreMarque: string; titreInformatif: string };
  typeContenu?: string;
  text: string;
  type: "a" | "button";
}

const MainContainer = styled.div`
  background-color: white;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  flex-direction: row;
  border-radius: 12px;
  height: 68px;
  width: 100%;
  padding: 24px;
  cursor: pointer;
  border: 0.5px solid transparent;
  margin-top: 10px;
  marfgin-bottom: 10px;
  align-items: center;
`;

const TextContainer = styled.div`
  margin-left: 10px;
`;

export const ShareButton = (props: Props) => {
  const emailBody = "Voici le lien vers cette fiche : " + window.location.href;
  const mailSubject = props.content
    ? props.typeContenu === "dispositif"
      ? `${props.content.titreInformatif} avec ${props.content.titreMarque}`
      : `${props.content.titreInformatif}`
    : "";

  return (
    <>
      {props.type === "button" && props.onClick && (
        <MainContainer onClick={props.onClick}>
          {/* {props.name && <Icon name={props.name} fill="#000000" size="large" />} */}
          {props.text && <TextContainer>{props.text}</TextContainer>}
        </MainContainer>
      )}
      {props.type === "a" && emailBody && (
        <a
          style={{ display: "flex", flexDirection: "row" }}
          href={`mailto:?subject=${mailSubject}&body=${emailBody}`}
        >
          <MainContainer>
            {/* {props.name && (
              <Icon name={props.name} fill="#000000" size="large" />
            )} */}
            {props.text && <TextContainer>{props.text}</TextContainer>}
          </MainContainer>
        </a>
      )}
    </>
  );
};
