import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { DispositifStatus } from "@refugies-info/api-types";
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

const Feedback = () => {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const mercis = useMemo(() => dispositif?.merci || [], [dispositif]);
  const [didThank, setDidThank] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [nbMercis, setNbMercis] = useState(mercis.length);

  const userId = useSelector(userSelector)?.userId;
  useEffect(() => {
    setDidThank(!!mercis.find((m) => m.userId === userId));
  }, [userId, mercis]);

  const isActive = useMemo(
    () => dispositif && (dispositif.status === DispositifStatus.ACTIVE || dispositif.hasDraftVersion),
    [dispositif],
  );
  const sendPositiveFeedback = useCallback(() => {
    if (!dispositif || !isActive) return;
    if (didThank) {
      API.deleteDispositifMerci(dispositif._id.toString())
        .then(() => {
          setDidThank(false);
          setNbMercis((c) => c - 1);
        })
        .catch((e) => logger.error(e));
    } else {
      Event("Reaction", "Merci", "from dispositif");
      API.addDispositifMerci(dispositif._id.toString())
        .then(() => {
          setDidThank(true);
          setShowToast(true);
          setNbMercis((c) => c + 1);
        })
        .catch((e) => logger.error(e));
    }
  }, [didThank, dispositif, isActive]);

  const sendNegativeFeedback = useCallback(() => {
    if (!isInBrowser()) return;
    window.$crisp.push(["set", "session:event", ["no-thanks-btn"]]);
    window.$crisp.push(["do", "chat:open"]);
  }, []);

  return (
    <div className={styles.container}>
      <Image src={FeedbackIllu} width={287} height={204} alt="" className={styles.illu} />
      <div className={styles.content}>
        <p className={styles.title}>{t("Dispositif.feedbackTitle")}</p>
        <p>{t("Dispositif.feedbackSubtitle")}</p>
        <Button
          priority={didThank ? "primary" : "secondary"}
          onClick={sendPositiveFeedback}
          className={cls(styles.btn, "me-2")}
        >
          <Image src={didThank ? ThumbUpFillIcon : ThumbUpIcon} width={24} height={24} alt="" className="me-2" />
          {t("Dispositif.nbThanks", { count: nbMercis })}
        </Button>
        <Button priority="secondary" onClick={sendNegativeFeedback} className={styles.btn} title={t("Aide")}>
          <Image src={ThumbDownIcon} width={24} height={24} alt="" />
        </Button>
      </div>

      {showToast && <Toast close={() => setShowToast(false)}>{t("Dispositif.feedbackThanks")}</Toast>}
    </div>
  );
};

export default Feedback;
