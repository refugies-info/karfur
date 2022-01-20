import React from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import FButton from "components/FigmaUI/FButton/FButton";
import { Props } from "./FeedbackFooter.container";
import { colors } from "colors";
import styles from "./FeedbackFooter.module.scss";

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: ${isMobile ? "column" : "row"};
  color: ${(props) => props.color};
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

const CountButtonContainer = styled.div`
  padding: 15px;
  display: flex;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 12px;
  font-weight: 700;
  line-height:20px;
  background-color:${(props) => (props.didThank ? colors.vert : colors.gris)}
  color:${(props) => (props.didThank ? colors.blancSimple : colors.noir)};
`;

export interface PropsBeforeInjection {
  t: any;
  pushReaction: (arg1: null, arg2: string) => void;
  didThank: boolean;
  nbThanks: number;
  window: any;
  color: string;
}

export const FeedbackFooter = (props: Props) => {
  const { nbThanks, t, pushReaction, didThank } = props;

  return (
    <FeedbackContainer color={props.color} className={styles.container}>
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
        <CountButtonContainer didThank={didThank}>
          {didThank ? nbThanks + 1 : nbThanks}{" "}
          <span role="img" aria-label="thanks" style={{ marginLeft: "5px" }}>
            🙏
          </span>
        </CountButtonContainer>

        {!didThank && (
          <FButton
            disabled={didThank}
            className={styles.btn + " validate mr-8 mb-8"}
            type="validate"
            onClick={() => pushReaction(null, "merci")}
          >
            <span role="img" aria-label="thanks">
              🙏
            </span>
            {t("Dispositif.Oui, merci !", "Oui, merci !")}
          </FButton>
        )}
        <FButton
          className={styles.btn + " mr-8 mb-8"}
          type="error"
          onClick={() => {
            props.window.$crisp.push([
              "set",
              "session:event",
              ["no-thanks-btn"],
            ]);
            props.window.$crisp.push(["do", "chat:open"]);
          }}
        >
          <span role="img" aria-label="thanks">
            😔
          </span>
          {t("Non", "Non")}
        </FButton>
      </ButtonContainer>
    </FeedbackContainer>
  );
};
