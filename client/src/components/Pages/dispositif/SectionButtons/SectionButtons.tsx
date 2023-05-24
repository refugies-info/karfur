import React, { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { InfoSection } from "@refugies-info/api-types";
import { cls } from "lib/classname";
import { changeRate, pauseAudio, readAudio, resumeAudio } from "lib/readAudio";
import { useEvent, useLocale } from "hooks";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";

import Tooltip from "components/UI/Tooltip";
import Toast from "components/UI/Toast";
import { getPlayIcon, getReadableText } from "./functions";
import styles from "./SectionButtons.module.scss";
import ReactionModal from "./ReactionModal";

interface Props {
  id: string;
  content: InfoSection | string;
}

/**
 * Suggestion and TTS buttons
 */
const SectionButtons = (props: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { Event } = useEvent();

  // tts
  const [showTtsButtons, setShowTtsButtons] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rateSpeed, setRateSpeed] = useState<1 | 2>(1);

  const startReading = useCallback(() => {
    if (!showTtsButtons) {
      // start
      readAudio(getReadableText(props.content), locale, () => setIsPlaying(false));
      setShowTtsButtons(true);
      Event("VOICEOVER", "click section button", "Dispo View");
    } else {
      // resume
      resumeAudio();
    }
    setIsPlaying(true);
  }, [locale, props.content, showTtsButtons, Event]);

  const pause = useCallback(() => {
    pauseAudio();
    setIsPlaying(false);
  }, []);

  const stopReading = useCallback(() => {
    pauseAudio();
    setShowTtsButtons(false);
    setIsPlaying(false);
  }, []);

  const toggleRateSpeed = useCallback(() => {
    setRateSpeed((r) => (r === 1 ? 2 : 1));
  }, []);
  useEffect(() => {
    changeRate(rateSpeed);
  }, [rateSpeed]);

  // reactions
  const dispositif = useSelector(selectedDispositifSelector);
  const [showToast, setShowToast] = useState(false);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const tooltipId = `section_${props.id.replace(".", "_")}`;

  return (
    <div className={cls(styles.container, showTtsButtons && styles.open)}>
      <Button
        priority={showTtsButtons ? "primary" : "tertiary"}
        icon={getPlayIcon(isPlaying, showTtsButtons)}
        className={styles.btn}
        onClick={isPlaying ? pause : startReading}
      />
      <div className={styles.tts_buttons}>
        <Button priority="tertiary" className={cls(styles.btn, styles.speed, "mt-1")} onClick={toggleRateSpeed}>
          {rateSpeed === 1 ? "x2" : "x1"}
        </Button>
        <Button evaIcon="close-outline" className={cls(styles.btn, styles.close, "mt-1")} onClick={stopReading} />
      </div>

      <Button
        priority="tertiary"
        evaIcon="message-circle-outline"
        className={cls(styles.btn, "mt-2")}
        id={tooltipId}
        onClick={() => setShowReactionModal(true)}
      />

      <Tooltip target={tooltipId} placement="right">
        {t("Dispositif.react")}
      </Tooltip>

      {showReactionModal && (
        <ReactionModal
          sectionKey={props.id}
          toggle={() => setShowReactionModal((o) => !o)}
          dispositifId={dispositif?._id}
          callback={() => setShowToast(true)}
        />
      )}
      {showToast && <Toast close={() => setShowToast(false)}>{t("Dispositif.reactFeedbackMessage")}</Toast>}
    </div>
  );
};

export default SectionButtons;
