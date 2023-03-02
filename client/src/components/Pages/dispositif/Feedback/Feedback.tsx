import React, { useCallback, useState } from "react";
import Image from "next/image";
import { cls } from "lib/classname";
import Button from "components/UI/Button";
import FeedbackIllu from "assets/dispositif/feedback-illu.svg";
import ThumbUpIcon from "assets/dispositif/thumb-up.svg";
import ThumbUpFillIcon from "assets/dispositif/thumb-up-fill.svg";
import ThumbDownIcon from "assets/dispositif/thumb-down.svg";
import styles from "./Feedback.module.scss";
import isInBrowser from "lib/isInBrowser";
import { Event } from "lib/tracking";
import API from "utils/API";
import { useSelector } from "react-redux";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { logger } from "logger";

interface Props {
  nbMercis: number;
}

const Feedback = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const [didThank, setDidThank] = useState(false);

  const sendPositiveFeedback = useCallback(() => {
    if (!dispositif || didThank) return;
    Event("Reaction", "Merci", "from dispositif");
    API.addDispositifMerci(dispositif._id.toString())
      .then(() => setDidThank(true))
      .catch((e) => logger.error(e));
  }, []);

  const sendNegativeFeedback = useCallback(() => {
    if (!isInBrowser()) return;
    window.$crisp.push(["set", "session:event", ["no-thanks-btn"]]);
    window.$crisp.push(["do", "chat:open"]);
  }, []);

  return (
    <div className={styles.container}>
      <Image src={FeedbackIllu} width={287} height={204} alt="" className={styles.illu} />
      <div className={styles.content}>
        <p className={styles.title}>Vous avez trouvé cette fiche utile ?</p>
        <p>Remerciez les contributeurs qui l’ont rédigée et traduite pour vous !</p>
        <Button secondary={!didThank} onClick={sendPositiveFeedback} className={cls(styles.btn, "me-2")}>
          <Image src={didThank ? ThumbUpFillIcon : ThumbUpIcon} width={24} height={24} alt="" className="me-2" />
          {props.nbMercis + (didThank ? 1 : 0)} mercis
        </Button>
        <Button secondary onClick={sendNegativeFeedback} className={styles.btn}>
          <Image src={ThumbDownIcon} width={24} height={24} alt="" />
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
