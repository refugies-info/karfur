import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { cls } from "lib/classname";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import { ReactionModal } from "components/Modals";
import Tooltip from "components/UI/Tooltip";
import Toast from "components/UI/Toast";
import { getPlayIcon } from "./functions";
import styles from "./SectionButtons.module.scss";

interface Props {
  id: string;
}

const SectionButtons = (props: Props) => {
  // tts
  const [showTtsButtons, setShowTtsButtons] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rateSpeed, setRateSpeed] = useState(1);
  const startReading = useCallback(() => {
    setShowTtsButtons(true);
    setIsPlaying(true);
  }, []);
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  const stopReading = useCallback(() => {
    setShowTtsButtons(false);
    setIsPlaying(false);
  }, []);
  const toggleRateSpeed = useCallback(() => {
    setRateSpeed((r) => (r === 1 ? 2 : 1));
  }, []);

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
