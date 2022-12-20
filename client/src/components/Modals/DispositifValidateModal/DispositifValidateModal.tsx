import React from "react";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import FButton from "components/UI/FButton/FButton";
import Check from "./components/Check";
import styles from "./DispositifValidateModal.module.scss";
import { Structure, Theme } from "types/interface";
import { useSelector } from "react-redux";
import { userSelector } from "services/User/user.selectors";

interface Props {
  show: boolean;
  typeContenu: string;
  toggle: any;
  abstract: string;
  onChange: any;
  titreInformatif: string;
  titreMarque: string;
  status: string | undefined;
  saveDispositif: (
    saveAndEdit: boolean,
    saveType: "auto" | "save" | "validate",
    routeAfterSave: string,
    bypassTraductionReview: boolean
  ) => void;
  theme: Theme | undefined;
  mainSponsor: Structure | undefined;
  menu: any;
  toggleThemesModal: any;
  toggleTutorielModal: any;
  toggleSponsorModal: any;
  toggleGeolocModal: any;
  addItem: any;
}

const DispositifValidateModal = (props: Props) => {
  const isAdmin = useSelector(userSelector)?.admin;
  const validateAndClose = (bypassTraductionReview: boolean) => {
    props.saveDispositif(false, "validate", "", bypassTraductionReview);
    props.toggle();
  };
  let geoloc = false;
  let geolocInfoCard = null;
  if (props.menu && props.menu[1] && props.menu[1].children && props.menu[1].children.length > 0) {
    geolocInfoCard = props.menu[1].children.find((elem: any) => elem.title === "Zone d'action");
    if (geolocInfoCard && geolocInfoCard.departments && geolocInfoCard.departments.length > 0) {
      geoloc = true;
    }
  }
  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <ModalHeader toggle={props.toggle} className={styles.modal_header}>
        Dernières vérifications
      </ModalHeader>
      <div>
        {props.typeContenu !== "demarche" ? (
          <Check
            geolocInfoCard={geolocInfoCard}
            section="geoloc"
            missingElement={!geoloc}
            toggleModal={props.toggleGeolocModal}
            addItem={props.addItem}
          />
        ) : null}

        <Check section="structure" missingElement={!props.mainSponsor} toggleModal={props.toggleSponsorModal} />

        <Check section="themes" missingElement={!props.theme} toggleModal={props.toggleThemesModal} />

        <Check
          section="sentence"
          abstract={props.abstract}
          onChange={props.onChange}
          missingElement={(props.abstract || "").length > 110 || !props.abstract}
          titreInformatif={props.titreInformatif}
          titreMarque={props.titreMarque}
          theme={props.theme}
          typeContenu={props.typeContenu}
        />
      </div>
      <ModalFooter className={styles.modal_footer}>
        <div>
          {isAdmin ? (
            <FButton type="fill-dark" name={"checkmark-outline"} onClick={() => validateAndClose(true)}>
              Conserver la traduction
            </FButton>
          ) : (
            <FButton type="tuto" name={"play-circle-outline"} onClick={() => props.toggleTutorielModal("Description")}>
              Tutoriel
            </FButton>
          )}
        </div>
        <div>
          <FButton type="outline-black" name={"arrow-back"} className="mr-8" onClick={props.toggle}>
            Retour
          </FButton>
          <FButton
            name="checkmark"
            type="validate-mockup"
            className={
              !props.abstract ||
              props.abstract === "" ||
              props.abstract.length > 110 ||
              (!geoloc && props.typeContenu !== "demarche") ||
              !!props.theme
                ? " disabled"
                : ""
            }
            disabled={
              !props.abstract ||
              props.abstract === "" ||
              props.abstract.length > 110 ||
              (!geoloc && props.typeContenu !== "demarche") ||
              !props.theme
            }
            onClick={() => validateAndClose(false)}
          >
            Valider
          </FButton>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default DispositifValidateModal;
