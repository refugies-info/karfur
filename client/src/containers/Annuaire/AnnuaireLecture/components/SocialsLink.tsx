import React from "react";
import styled from "styled-components";
import FButton from "../../../../components/FigmaUI/FButton/FButton";

const ButtonContainer = styled.div`
  margin-bottom: 4px;
  margin-top: 4px;
`;
interface Props {
  websites: string[];
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
}

const onLinkClicked = (link: string | null) => {
  if (!link) return;
  // @ts-ignore
  window.open((link.includes("http") ? "" : "http://") + link, "_blank");
};
export const SocialsLink = (props: Props) => (
  <div>
    {props.websites.map((website) => (
      <ButtonContainer>
        <FButton
          type="white"
          name="download-outline"
          onClick={() => onLinkClicked(website)}
        >
          Visiter le site internet
        </FButton>
      </ButtonContainer>
    ))}
    {props.facebook && (
      <ButtonContainer>
        <FButton
          type="white"
          name="download-outline"
          onClick={() => onLinkClicked(props.facebook)}
        >
          Suivre sur Facebook
        </FButton>
      </ButtonContainer>
    )}
    {props.twitter && (
      <ButtonContainer>
        <FButton
          type="white"
          name="download-outline"
          onClick={() => onLinkClicked(props.twitter)}
        >
          Suivre sur Twitter
        </FButton>
      </ButtonContainer>
    )}
    {props.linkedin && (
      <ButtonContainer>
        <FButton
          type="white"
          name="download-outline"
          onClick={() => onLinkClicked(props.linkedin)}
        >
          Suivre sur LinkedIn
        </FButton>
      </ButtonContainer>
    )}
  </div>
);
