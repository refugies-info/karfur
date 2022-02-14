import React from "react";
import { Modal } from "reactstrap";
import FButton from "components/FigmaUI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./DraftModal.module.scss";

interface Props {
  toggle: () => void;
  show: boolean;
  saveDispositif: (
    arg: string,
    arg1: boolean,
    arg2: boolean,
    arg3: boolean,
    arg4: boolean
  ) => void;
  navigateToMiddleOffice: () => void;
  status: string;
  toggleIsModified: (arg: boolean) => void;
  toggleIsSaved: (arg: boolean) => void;
}

interface InfoProps {
  title: string;
  subTitle: string;
  footer: string;
  footerIcon: string;
  color: string;
}

const InfoLeft = (props: InfoProps) => (
  <div className={styles.left}>
    <h3 className={styles.title} style={{ color: props.color }}>
      {props.title}
    </h3>
    <p className={styles.subtitle}>{props.subTitle}</p>
    <div className={styles.infos_footer}>
      <EVAIcon
        size={10}
        name={props.footerIcon}
        fill={props.color}
        className="mr-8"
      />
      <div style={{ color: props.color }}>{props.footer}</div>
    </div>
  </div>
);

const InfoRight = (props: InfoProps) => (
  <div className={styles.right}>
    <h3 className={styles.title} style={{ color: props.color }}>
      {props.title}
    </h3>
    <p className={styles.subtitle}>{props.subTitle}</p>
    <div className={styles.right}>
      <EVAIcon
        size={10}
        name={props.footerIcon}
        fill={props.color}
        className="mr-8"
      />
      <div style={{ color: props.color }}>{props.footer}</div>
    </div>
  </div>
);

export const DraftModal = (props: Props) => (
  <Modal
    isOpen={props.show}
    toggle={props.toggle}
    className={styles.modal}
    contentClassName={styles.modal_content}
  >
    <div className={styles.container}>
      <div className={styles.close} onClick={props.toggle}>
        <EVAIcon name="close-outline" fill="#3D3D3D" size="large" />
      </div>
      <h2 className={styles.header}>Sauvegarder</h2>
      <div className={styles.infos_container}>
        <div style={{ marginRight: "8px" }}>
          <InfoLeft
            title="Pas de panique !"
            subTitle="Votre fiche est sauvegardée automatiquement"
            footer="toutes les 3 minutes"
            footerIcon="clock-outline"
            color="#3D2884"
          />
        </div>
        <InfoRight
          title="Bon à savoir"
          subTitle="Une fois sauvegardée, votre fiche est visible dans l'espace"
          footer="Mes fiches"
          footerIcon="file-text-outline"
          color="#149193"
        />
      </div>
      <div className={styles.btn_container}>
        <FButton
          type="outline-black"
          name="log-out-outline"
          className="mr-8"
          onClick={() => {
            props.saveDispositif(
              props.status || "Brouillon",
              false,
              true,
              false,
              false
            );
            props.toggle();
            props.toggleIsModified(false);
            props.toggleIsSaved(true);
            props.navigateToMiddleOffice();
          }}
        >
          Finir plus tard
        </FButton>
        <FButton
          type="validate"
          name="save-outline"
          onClick={() => {
            props.saveDispositif(
              props.status || "Brouillon",
              false,
              true,
              true,
              true
            );
            props.toggleIsModified(false);
            props.toggleIsSaved(true);
            props.toggle();
          }}
        >
          Sauvegarder et continuer à rédiger
        </FButton>
      </div>
    </div>
  </Modal>
);
