import React from "react";
import { Props } from "./FeedbackFooter.container";
import FButton from "../../../FigmaUI/FButton/FButton";

export interface PropsBeforeInjection {
  t: any;
  pushReaction: (arg1: null, arg2: string) => void;
  didThank: boolean;
}

export const FeedbackFooter = (props: Props) => {
  const { t, pushReaction, didThank } = props;
  return (
    <div className="feedback-footer">
      <div>
        <h5 className="color-darkColor">
          {t(
            "Dispositif.informations_utiles",
            "Vous avez trouvé des informations utiles ?"
          )}
        </h5>
        <span className="color-darkColor">
          {t(
            "Dispositif.remerciez",
            "Remerciez les contributeurs qui les ont rédigé pour vous"
          )}
          &nbsp;:
        </span>
      </div>
      <div>
        <FButton
          className={"thanks" + (didThank ? " clicked" : "")}
          onClick={() => pushReaction(null, "merci")}
        >
          {t("Dispositif.Merci", "Merci")}
        </FButton>
      </div>
    </div>
  );
};
