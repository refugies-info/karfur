import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Tooltip } from "reactstrap";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import { ReactionModal } from "components/Modals";
import Toast from "components/UI/Toast";
import styles from "./SectionButtons.module.scss";

interface Props {
  id: string;
}

const SectionButtons = (props: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);

  const [showToast, setShowToast] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen((o) => !o);

  const [showReactionModal, setShowReactionModal] = useState(false);

  const tooltipId = `section_${props.id.replace(".", "_")}`;
  return (
    <div className={styles.container}>
      <Button tertiary icon="play-circle-outline" className={styles.btn} />
      <Button
        tertiary
        icon="message-circle-outline"
        className={styles.btn}
        id={tooltipId}
        onClick={() => setShowReactionModal(true)}
      />

      <Tooltip target={tooltipId} isOpen={tooltipOpen} toggle={toggle} placement="right">
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
