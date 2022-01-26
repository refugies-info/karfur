import React from "react";
import { Modal } from "reactstrap";
import { useTranslation } from "react-i18next";
import { colors } from "colors";
import _ from "lodash";

import FButton from "../../FigmaUI/FButton/FButton";
import { sectionUrlCorrespondencies } from "./data";

import styles from "./FrameModal.module.scss";

interface Props {
  show: boolean;
  toggle: any;
  section: string;
}

const FrameModal = (props: Props) => {
  const { t } = useTranslation();

  const getTutoUrl = () => {
    const defaultUrl =
      "https://help.refugies.info/fr/article/comment-creer-une-page-dispositif-d82wz7";
    if (!props.section) {
      return defaultUrl;
    }
    const sectionUrlCorrespondency = _.find(sectionUrlCorrespondencies, {
      section: props.section,
    });

    if (!sectionUrlCorrespondency || !sectionUrlCorrespondency.tutoUrl) {
      return defaultUrl;
    }
    return sectionUrlCorrespondency.tutoUrl;
  };

  return (
    <Modal
      isOpen={props.show}
      toggle={() => props.toggle("")}
      className={styles.modal}
      contentClassName={styles.modal_content}
    >
      <div className={styles.container}>
        <FButton
          href={getTutoUrl()}
          type="dark"
          name="external-link"
          fill={colors.noir}
          className="mr-10"
          target="_blank"
        >
          Voir dans le centre d&apos;aide
        </FButton>
        <FButton
          type="tuto"
          name="checkmark"
          className="ml-10"
          onClick={() => props.toggle("")}
        >
          Compris !
        </FButton>
      </div>
      <iframe
        className={styles.iframe}
        allowFullScreen
        src={getTutoUrl() + "/reader/"}
      />
    </Modal>
  );
};

export default FrameModal;
