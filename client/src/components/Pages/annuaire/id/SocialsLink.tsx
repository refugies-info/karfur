import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import FButton from "components/FigmaUI/FButton/FButton";

declare const window: Window;
const ButtonContainer = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
`;
interface Props {
  websites: string[] | undefined;
  facebook: string | undefined;
  twitter: string | undefined;
  linkedin: string | undefined;
}

const onLinkClicked = (link: string | undefined) => {
  if (!link) return;
  window.open((link.includes("http") ? "" : "http://") + link, "_blank");
};

export const SocialsLink = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      {props.websites &&
        props.websites.map((website) => (
          <ButtonContainer key={website}>
            <FButton
              type="white"
              name="globe"
              onClick={() => onLinkClicked(website)}
            >
              {t("Annuaire.Visiter internet", "Visiter le site internet")}
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
            {t("Annuaire.facebook", "Suivre sur Facebook")}
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
            {t("Annuaire.twitter", "Suivre sur Twitter")}
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
            {t("Annuaire.linkedin", "Suivre sur LinkedIn")}
          </FButton>
        </ButtonContainer>
      )}
    </div>
  )
}
