import React, { useEffect, useState } from "react";
import { ModalBody, ModalFooter } from "reactstrap";

import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { interieur_2, interieur_3, interieur_4 } from "assets/figma";
import FButton from "components/UI/FButton/FButton";
import Modal from "../Modal";

import { colors } from "colors";
import styles from "./DemarcheCreateModal.module.scss";
import Image from "next/image";

interface Props {
  show: boolean;
  toggle: any;
  onBoardSteps: any;
  typeContenu: string;
}

const DemarcheCreateModal = (props: Props) => {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (props.show && stepIdx !== 0) {
      setStepIdx(0);
    }
  }, [props.show, stepIdx]);

  const changeStep = (next = true) => setStepIdx(stepIdx + (next ? 1 : -1));

  return (
    <Modal
      show={props.show}
      toggle={props.toggle}
      className={styles.modal}
      modalHeader={
        <div className={styles.modal_header}>
          {stepIdx === 0
            ? props.typeContenu === "demarche"
              ? "Ajoutez une démarche"
              : "C’est parti !"
            : props.onBoardSteps[stepIdx].title}
          {stepIdx === 0 && (
            <div className={styles.temps_right}>
              <EVAIcon
                className="mr-8"
                name="clock-outline"
                size="large"
                fill={colors.gray90}
              />
              <span className={styles.inline_custom}>
                ≈ {props.typeContenu === "demarche" ? 40 : 20} min
              </span>
            </div>
          )}{" "}
        </div>
      }
    >
      <ModalBody>
        {stepIdx === 0 ? (
          <>
            <div className={styles.content}>
              <h5>1. Gardez en tête le public de la plateforme</h5>
              <ul className={styles.list}>
                <li>
                  Vous vous adressez à des personnes réfugiées : le vocabulaire
                  employé doit être simple et accessible.
                </li>
                <li>
                  Il ne s’agit pas d’un support de communication
                  institutionnelle mais d’une fiche pratique qui donne les
                  principales informations de votre dispositifs. Le contenu doit
                  être synthétique et vulgarisé.
                </li>
                <li>
                  La lecture complète de la fiche ne devrait pas excéder{" "}
                  {props.typeContenu === "demarche" ? "trois" : "deux"} minutes.
                </li>
              </ul>
            </div>
            <div className={styles.content}>
              <h5>2. Pas d’inquiétude, nous ne sommes pas loin !</h5>
              <ul className={styles.list}>
                <li>
                  Une fois votre rédaction terminée, notre équipe (ou la
                  structure responsable de votre fiche) sera notifiée pour
                  procéder à d’éventuelles corrections ou vérifications.{" "}
                </li>
                <li>
                  Après publication, vous pourrez accéder à la fiche depuis
                  votre profil et vous recevrez des notifications lorsqu’un
                  utilisateur vous remercie ou réagit sur certaines parties de
                  votre fiche.
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className={styles.image}>
              <Image
                src={
                  stepIdx === 1
                    ? interieur_2
                    : stepIdx === 2
                    ? interieur_3
                    : interieur_4
                }
                alt="step illustration"
              />
            </div>
            {props.onBoardSteps[stepIdx].content}
          </div>
        )}
      </ModalBody>
      <ModalFooter className={styles.modal_footer}>
        <div className="align-left">
          <ul className="nav nav-tabs" role="tablist">
            {props.onBoardSteps.map((_: any, idx: number) => (
              <li
                role="presentation"
                className={
                  stepIdx === props.onBoardSteps.length - 1
                    ? `${styles.active} ${styles.ended}`
                    : idx <= stepIdx
                    ? styles.active
                    : "disabled"
                }
                key={idx}
              >
                <span className={styles.round_tab} />
              </li>
            ))}
          </ul>
        </div>
        <div className="align-right">
          {stepIdx === 0 ? (
            <FButton
              type="outline-black"
              onClick={props.toggle}
              className="mr-10"
            >
              Annuler
            </FButton>
          ) : (
            <FButton
              type="outline-black"
              name="arrow-back"
              fill={colors.gray90}
              onClick={() => changeStep(false)}
              className="mr-10"
            />
          )}
          {stepIdx === props.onBoardSteps.length - 1 ? (
            <FButton type="validate" name="checkmark" onClick={props.toggle}>
              Démarrer
            </FButton>
          ) : (
            <FButton
              type="outline-black"
              name="arrow-forward"
              fill={colors.gray90}
              onClick={changeStep}
            />
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default DemarcheCreateModal;
