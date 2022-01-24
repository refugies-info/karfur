import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Label,
  Input,
} from "reactstrap";
import _ from "lodash";
import ContentEditable from "react-contenteditable";
import ReactToPrint from "react-to-print";
import FButton from "components/FigmaUI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import Modal from "../Modal";
import styles from "./EtapeModal.module.scss";

interface Props {
  show: boolean;
  toggle: any;
  subitem: any;
  upcoming: any;
  content: any;
  subkey: any;
}

const EtapeModal = (props: Props) => {
  const [checked, setChecked] = useState<any[]>([]);
  const modalRef: any = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    const newLength = _.get(props, "subitem.papiers", []).length;
    if (newLength !== checked.length) {
      setChecked(new Array(newLength).fill(false));
    }
  }, [props.subitem]);

  const handleCheck = (idx: number) =>
    setChecked(checked.map((x, i) => (i === idx ? !x : x)));

  const handleCtaClick = () => {
    const option = (props.subitem || {}).option || {};
    switch (option.texte) {
      case "En ligne":
        window.open(
          (option.value1.indexOf("http") > -1 ? "" : "http://") + option.value1,
          "_blank"
        );
        break;
      case "En physique":
        props.upcoming();
        break;
      default:
      //
    }
  };

  const option = props.subitem?.option || {};
  const array1 = ["En ligne", "En physique", "Par téléphone"];
  const displayedText = array1.includes(option.texte)
    ? option.value1
    : option.texte === "Par courrier"
    ? [option.value1, option.value2, option.value3, option.value4].join(", ")
    : [option.value1, option.value2].join(" : ");
  return (
    <Modal
      show={props.show}
      toggle={props.toggle}
      modalRef={modalRef}
      className={styles.modal}
      modalHeader={
        <>
          <div className={styles.title_wrapper}>
            <span className={styles.title}>
              {props.content.titreInformatif}
            </span>
            <span className={styles.subtitle}>
              Étape #{props.subkey + 1} - {props.subitem.title}
            </span>
          </div>
          <ReactToPrint
            trigger={() => (
              <FButton
                type="light-action"
                name="printer-outline"
                fill={colors.noir}
              >
                {t("Dispositif.Imprimer", "Imprimer")}
              </FButton>
            )}
            content={() => (modalRef ? modalRef.current : null)}
          />
        </>
      }
    >
      <ModalBody>
        <h5>{option.modalHeader}</h5>
        <div className={styles.infos} onClick={handleCtaClick}>
          <h5>
            {displayedText}
            <div
              className={styles.copy}
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(displayedText);
              }}
            >
              <EVAIcon name="copy-outline" fill={colors.noir} />
            </div>
          </h5>
        </div>

        {props.subitem.papiers && props.subitem.papiers.length > 0 && (
          <>
            <h5>Documents nécessaires ({props.subitem.papiers.length})</h5>
            <ListGroup className={styles.list}>
              {props.subitem.papiers.map((papier: any, idx: number) => {
                if (checked[idx] !== undefined) {
                  return (
                    <ListGroupItem
                      key={idx}
                      className={
                        styles.item + checked[idx]
                          ? styles.checked
                          : "unchecked"
                      }
                    >
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={checked[idx]}
                          onChange={() => handleCheck(idx)}
                        />{" "}
                        <span>{papier.texte}</span>
                      </Label>
                    </ListGroupItem>
                  );
                }
                return false;
              })}
            </ListGroup>
          </>
        )}

        <h5>Précisions</h5>
        <div className="texte-very-small">
          <ContentEditable
            className="animated fadeIn"
            html={props.subitem.content || ""}
            disabled={true}
            onChange={() => {}}
          />
        </div>
      </ModalBody>
      <ModalFooter className={styles.modal_footer}>
        <FButton
          type="help"
          name="question-mark-circle-outline"
          fill={colors.error}
          onClick={props.upcoming}
        >
          {t("J'ai besoin d'aide")}
        </FButton>
        <FButton
          type="validate"
          name="checkmark-outline"
          onClick={props.toggle}
          fill={colors.noir}
        >
          {t("Dispositif.compris", "Ok, j’ai compris")}
        </FButton>
      </ModalFooter>
    </Modal>
  );
};

export default EtapeModal;
