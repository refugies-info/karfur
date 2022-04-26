import React from "react";
import { Modal } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { ShareButton } from "components/UI/ShareButton/ShareButton";
import {
  send_sms,
  sharingOptions,
} from "components/Pages/dispositif/function";
import { Event } from "lib/tracking";
import styles from "./ShareContentOnMobileModal.module.scss";

declare const window: Window;
interface Props {
  toggle: () => void;
  show: boolean;
  content: {
    titreInformatif: string;
    titreMarque: string;
    abstract: string;
    contact: string;
    externalLink: string;
  };
  typeContenu: string;
  t: any;
}

export const ShareContentOnMobileModal = (props: Props) => {
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className={styles.modal}
      contentClassName={styles.modal_content}
    >
      <div className={styles.container}>
        <div
          onClick={props.toggle}
          className={styles.close}
        >
          <EVAIcon name="close-outline" fill="#FFFFFF" size="large" />
        </div>
        <h2 className={styles.header}>
          {props.t("Dispositif.Partager Fiche", "Partager la fiche")}
        </h2>
        <div className={styles.btn_container}>
          <ShareButton
            name={"email-outline"}
            content={props.content}
            type="a"
            text={props.t("Dispositif.Via email", "Via email")}
          />

          <ShareButton
            name={"smartphone-outline"}
            onClick={() => {
              Event("Share", "SMS", "from dispositif mobile modal");
              send_sms(
                "Veuillez renseigner un numéro de téléphone",
                props.typeContenu,
                props.content.titreInformatif
              )
            }}
            text={props.t("Dispositif.Via sms", "Via sms")}
            type="button"
          />

          <ShareButton
            name={"more-horizontal-outline"}
            onClick={() => {
              sharingOptions(
                props.typeContenu,
                props.content.titreInformatif,
                props.content.titreMarque
              );
            }}
            text={props.t("Dispositif.Plus options", "Plus d'options")}
            type="button"
          />
        </div>
      </div>
    </Modal>
  );
};
