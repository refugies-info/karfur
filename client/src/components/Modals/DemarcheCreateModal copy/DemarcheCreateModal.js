import React from "react";
import { ModalBody, ModalFooter, Modal } from "reactstrap";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";

export const DemarcheCreateModal = (props) => (
  <Modal
    className="dispositif-create-modal"
    modalHeader={
      <>
        {stepIdx === 0
          ? typeContenu === "demarche"
            ? "Ajoutez une démarche"
            : "C’est parti !"
          : onBoardSteps[stepIdx].title}
        {stepIdx === 0 && (
          <div className="temps-right">
            <EVAIcon
              className="mr-8"
              name="clock-outline"
              size="large"
              fill={variables.noir}
            />
            <span className="inline-custom">
              ≈ {typeContenu === "demarche" ? 40 : 20} min
            </span>
          </div>
        )}{" "}
      </>
    }
    {...this.props}
  >
    <ModalBody>
      {stepIdx === 0 ? (
        <>
          <div className="content-bloc">
            <h5>1. Gardez en tête le public de la plateforme</h5>
            <ul className="liste-classic">
              <li>
                Vous vous adressez à des personnes réfugiées : le vocabulaire
                employé doit être simple et accessible.
              </li>
              <li>
                Il ne s’agit pas d’un support de communication institutionnelle
                mais d’une fiche pratique qui donne les principales informations
                de votre dispositifs. Le contenu doit être synthétique et
                vulgarisé.
              </li>
              <li>
                La lecture complète de la fiche ne devrait pas excéder{" "}
                {typeContenu === "demarche" ? "trois" : "deux"} minutes.
              </li>
            </ul>
          </div>
          <div className="content-bloc">
            <h5>2. Pas d’inquiétude, nous ne sommes pas loin !</h5>
            <ul className="liste-classic">
              <li>
                Une fois votre rédaction terminée, notre équipe (ou la structure
                responsable de votre fiche) sera notifiée pour procéder à
                d’éventuelles corrections ou vérifications.{" "}
              </li>
              <li>
                Après publication, vous pourrez accéder à la fiche depuis votre
                profil et vous recevrez des notifications lorsqu’un utilisateur
                vous remercie ou réagit sur certaines parties de votre fiche.
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="tuto-wrapper">
          <div className="image-figma">
            <img
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
          {onBoardSteps[stepIdx].content}
        </div>
      )}
    </ModalBody>
    <ModalFooter>
      <div className="align-left">
        <ul className="nav nav-tabs" role="tablist">
          {onBoardSteps.map((_, idx) => (
            <li
              role="presentation"
              className={
                stepIdx === onBoardSteps.length - 1
                  ? "active ended"
                  : idx <= stepIdx
                  ? "active"
                  : "disabled"
              }
              key={idx}
            >
              <span className="round-tab" />
            </li>
          ))}
        </ul>
      </div>
      <div className="align-right">
        {stepIdx === 0 ? (
          <FButton type="outline-black" onClick={toggle} className="mr-10">
            Annuler
          </FButton>
        ) : (
          <FButton
            type="outline-black"
            name="arrow-back"
            fill={variables.noir}
            onClick={() => this.changeStep(false)}
            className="mr-10"
          />
        )}
        {stepIdx === onBoardSteps.length - 1 ? (
          <FButton type="validate" name="checkmark" onClick={this.props.toggle}>
            Démarrer
          </FButton>
        ) : (
          <FButton
            type="outline-black"
            name="arrow-forward"
            fill={variables.noir}
            onClick={this.changeStep}
          />
        )}
      </div>
    </ModalFooter>
  </Modal>
);
