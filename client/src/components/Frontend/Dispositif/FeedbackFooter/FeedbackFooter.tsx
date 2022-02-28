import React from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { useTranslation } from "next-i18next";
import FButton from "components/FigmaUI/FButton/FButton";
import { colors } from "colors";
import styles from "./FeedbackFooter.module.scss";
import isInBrowser from "lib/isInBrowser";

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: ${isMobile ? "column" : "row"};
  color: ${(props: {color: string}) => props.color};
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
  font-weight: bold;
  line-height:20px;
  background-color:${(props: {didThank: boolean}) => (props.didThank ? colors.vert : colors.gray20)}
  color:${(props: {didThank: boolean}) => (props.didThank ? colors.white : colors.gray90)};
`;

interface Props {
  pushReaction: (arg1: null, arg2: string) => void;
  didThank: boolean;
  nbThanks: number;
  color: string;
}

const FeedbackFooter = (props: Props) => {
  const { t } = useTranslation();
  const { nbThanks, pushReaction, didThank } = props;

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
            if (!isInBrowser()) return;
            (window as any).$crisp.push([
              "set",
              "session:event",
              ["no-thanks-btn"],
            ]);
            (window as any).$crisp.push(["do", "chat:open"]);
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

export default FeedbackFooter;
