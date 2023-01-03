import React from "react";
import { useTranslation } from "next-i18next";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import FButton from "components/UI/FButton/FButton";
import { Event } from "lib/tracking";
import { Language } from "types/interface";
import styles from "./LanguagetoReadModal.module.scss";

interface Props {
  show: boolean;
  toggle: any;
  languages: Language[];
  changeLanguage: any;
}

export const LanguageToReadModal = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className="language-modal">
      <ModalHeader toggle={props.toggle}>
        <span className="title">{t("Dispositif.Lire en", "Lire en : ")}</span>
      </ModalHeader>
      <ModalBody>
        <div className={styles.btn_container}>
          {props.languages.map((langue, index) => {
            return (
              <FButton
                key={index}
                type="white"
                className="mb-4"
                style={{
                  boxShadow: "0px 8px 16px rgba(33, 33, 33, 0.24)",
                  width: "auto",
                  height: "56px"
                }}
                onClick={() => {
                  Event("CHANGE_LANGUAGE", langue.i18nCode, "label");
                  props.changeLanguage(langue.i18nCode);
                  props.toggle();
                }}
              >
                <span className={"fi fi-" + langue.langueCode} title={langue.langueCode} id={langue.langueCode} />
                <span className="ms-2 language-name">{langue.langueLoc || "Langue"}</span>
              </FButton>
            );
          })}
        </div>
      </ModalBody>
    </Modal>
  );
};
