import React from "react";
import { useTranslation } from "next-i18next";
import FButton from "components/UI/FButton/FButton";
import styles from "./FeedbackFooter.module.scss";
import isInBrowser from "lib/isInBrowser";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
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
    <div style={{ color: props.color }} className={styles.container}>
      <div className={styles.text_container}>
        <h5 className="h5" style={{ color: props.color }}>
          {t("Dispositif.informations_utiles", "Vous avez trouvé des informations utiles ?")}
        </h5>

        {t("Dispositif.remerciez", "Remerciez les contributeurs qui les ont rédigées pour vous")}
      </div>
      <div className={styles.btn_container}>
        <div className={cls(styles.thank_button, didThank && styles.active)}>
          {didThank ? nbThanks + 1 : nbThanks}{" "}
          <span role="img" aria-label="thanks" style={{ marginLeft: "5px" }}>
            🙏
          </span>
        </div>

        {!didThank && (
          <FButton
            disabled={didThank}
            className={styles.btn + " validate mr-8 mb-8"}
            type="validate"
            onClick={() => {
              Event("Reaction", "Merci", "from dispositif");
              pushReaction(null, "merci");
            }}
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
            window.$crisp.push(["set", "session:event", ["no-thanks-btn"]]);
            window.$crisp.push(["do", "chat:open"]);
          }}
        >
          <span role="img" aria-label="thanks">
            😔
          </span>
          {t("Non", "Non")}
        </FButton>
      </div>
    </div>
  );
};

export default FeedbackFooter;
