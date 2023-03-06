import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { GetDispositifResponse } from "api-types";
import { logger } from "logger";
import { cls } from "lib/classname";
import isInBrowser from "lib/isInBrowser";
import { Event } from "lib/tracking";
import API from "utils/API";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { userSelector } from "services/User/user.selectors";
import Button from "components/UI/Button";
import Toast from "components/UI/Toast";
import FeedbackIllu from "assets/dispositif/feedback-illu.svg";
import ThumbUpIcon from "assets/dispositif/thumb-up.svg";
import ThumbUpFillIcon from "assets/dispositif/thumb-up-fill.svg";
import ThumbDownIcon from "assets/dispositif/thumb-down.svg";
import styles from "./Feedback.module.scss";

interface Props {
  mercis: GetDispositifResponse["merci"];
}

const Feedback = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const [didThank, setDidThank] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [nbMercis, setNbMercis] = useState(props.mercis.length);

  const userId = useSelector(userSelector)?.userId;
  useEffect(() => {
    setDidThank(!!props.mercis.find((m) => m.userId === userId));
  }, [userId, props.mercis]);

  const sendPositiveFeedback = useCallback(() => {
    if (!dispositif || didThank) return;
    Event("Reaction", "Merci", "from dispositif");
    API.addDispositifMerci(dispositif._id.toString())
      .then(() => {
        setDidThank(true);
        setShowToast(true);
        setNbMercis((c) => c + 1);
      })
      .catch((e) => logger.error(e));
  }, [didThank, dispositif]);

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
          {nbMercis} mercis
        </Button>
        <Button secondary onClick={sendNegativeFeedback} className={styles.btn}>
          <Image src={ThumbDownIcon} width={24} height={24} alt="" />
        </Button>
      </div>

      {showToast && <Toast close={() => setShowToast(false)}>Merci pour votre retour !</Toast>}
    </div>
  );
};

export default Feedback;
