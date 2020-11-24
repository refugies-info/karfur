import React from "react";
import styled from "styled-components";
import FButton from "../../../../../components/FigmaUI/FButton/FButton";

const ButtonContainer = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
`;
interface Props {
  websites: string[] | undefined;
  facebook: string | undefined;
  twitter: string | undefined;
  linkedin: string | undefined;
  t: any;
}

const onLinkClicked = (link: string | undefined) => {
  if (!link) return;
  // @ts-ignore
  window.open((link.includes("http") ? "" : "http://") + link, "_blank");
};
export const SocialsLink = (props: Props) => (
  <div>
    {props.websites &&
      props.websites.map((website) => (
        <ButtonContainer key={website}>
          <FButton
            type="white"
            name="globe"
            onClick={() => onLinkClicked(website)}
          >
            {props.t("Annuaire.Visiter internet", "Visiter le site internet")}
          </FButton>
        </ButtonContainer>
      ))}
    {props.facebook && (
      <ButtonContainer>
        <FButton
          type="white"
          name="facebook"
          onClick={() => onLinkClicked(props.facebook)}
        >
          {props.t("Annuaire.facebook", "Suivre sur Facebook")}
        </FButton>
      </ButtonContainer>
    )}
    {props.twitter && (
      <ButtonContainer>
        <FButton
          type="white"
          name="twitter"
          onClick={() => onLinkClicked(props.twitter)}
        >
          {props.t("Annuaire.twitter", "Suivre sur Twitter")}
        </FButton>
      </ButtonContainer>
    )}
    {props.linkedin && (
      <ButtonContainer>
        <FButton
          type="white"
          name="linkedin"
          onClick={() => onLinkClicked(props.linkedin)}
        >
          {props.t("Annuaire.linkedin", "Suivre sur LinkedIn")}
        </FButton>
      </ButtonContainer>
    )}
  </div>
);
