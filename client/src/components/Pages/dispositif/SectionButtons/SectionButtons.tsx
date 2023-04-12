import React, { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { InfoSection } from "api-types";
import { cls } from "lib/classname";
import { changeRate, pauseAudio, readAudio, resumeAudio } from "lib/readAudio";
import { useLocale } from "hooks";
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
  const locale = useLocale();

  // tts
  const [showTtsButtons, setShowTtsButtons] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rateSpeed, setRateSpeed] = useState<1 | 2>(1);

  const startReading = useCallback(() => {
    if (!showTtsButtons) {
      // start
      readAudio(getReadableText(props.content), locale, () => setIsPlaying(false));
      setShowTtsButtons(true);
    } else {
      // resume
      resumeAudio();
    }
    setIsPlaying(true);
  }, [locale, props.content, showTtsButtons]);

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
        tertiary={!showTtsButtons}
        icon={getPlayIcon(isPlaying, showTtsButtons)}
        className={styles.btn}
        onClick={isPlaying ? pause : startReading}
      />
      <div className={styles.tts_buttons}>
        <Button tertiary className={cls(styles.btn, styles.speed, "mt-1")} onClick={toggleRateSpeed}>
          {rateSpeed === 1 ? "x2" : "x1"}
        </Button>
        <Button icon="close-outline" className={cls(styles.btn, styles.close, "mt-1")} onClick={stopReading} />
      </div>

      <Button
        tertiary
        icon="message-circle-outline"
        className={cls(styles.btn, "mt-2")}
        id={tooltipId}
        onClick={() => setShowReactionModal(true)}
      />

      <Tooltip target={tooltipId} placement="right">
        Réagir
      </Tooltip>

      {showReactionModal && (
        <ReactionModal
          sectionKey={props.id}
          toggle={() => setShowReactionModal((o) => !o)}
          dispositifId={dispositif?._id}
          callback={() => setShowToast(true)}
        />
      )}
      {showToast && <Toast close={() => setShowToast(false)}>Votre réaction a bien été enregistrée, merci !</Toast>}
    </div>
  );
};

export default SectionButtons;
