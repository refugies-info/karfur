import React from "react";
import { Props } from "./FeedbackFooter.container";
import FButton from "../../../FigmaUI/FButton/FButton";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: ${isMobile ? "column" : "row"};
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: ${isMobile ? "column" : "row"};
  align-items: center;
  width: ${isMobile ? "-webkit-fill-available" : ""};
`;
const TextContainer = styled.div`
  text-align: ${isMobile ? "center" : ""};
  margin-bottom: ${isMobile ? "16px" : ""};
`;

export interface PropsBeforeInjection {
  t: any;
  pushReaction: (arg1: null, arg2: string) => void;
  didThank: boolean;
  nbThanks: number;
}

export const FeedbackFooter = (props: Props) => {
  const { nbThanks, t, pushReaction, didThank } = props;
  return (
    <FeedbackContainer className="feedback-footer">
      <TextContainer>
        <h5>
          {t(
            "Dispositif.informations_utiles",
            "Vous avez trouvé des informations utiles ?"
          )}
        </h5>

        {t(
          "Dispositif.remerciez",
          "Remerciez les contributeurs qui les ont rédigées pour vous"
        )}
      </TextContainer>
      <ButtonContainer>
        <FButton
          className={
            didThank
              ? " validate mr-8 mb-8 feedback-btn"
              : "disabled mr-8 mb-8 feedback-btn"
          }
        >
          <div style={{ color: didThank ? "" : "black" }}>
            {didThank ? nbThanks + 1 : nbThanks}{" "}
            <span role="img" aria-label="thanks">
              🙏
            </span>
          </div>
        </FButton>
        {!didThank && (
          <FButton
            disabled={didThank}
            className={"feedback-btn validate mr-8 mb-8"}
            onClick={() => pushReaction(null, "merci")}
          >
            <span role="img" aria-label="thanks">
              🙏
            </span>
            {t("Dispositif.Oui, merci !", "Oui, merci !")}
          </FButton>
        )}
        <a>
          <FButton
            className={" feedback-btn error mr-8 mb-8 "}
            id="no-thanks-btn"
          >
            <span role="img" aria-label="thanks">
              😔
            </span>
            {t("Non", "Non")}
          </FButton>
        </a>
      </ButtonContainer>
    </FeedbackContainer>
  );
};
