import React, { useCallback, useState } from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { ModalAvailability, ModalConditions, ModalLocation, ModalPrice, ModalPublic, ModalThemes } from "../Modals";
import AddContentButton from "../AddContentButton";
import styles from "./LeftSidebarEdition.module.scss";

type Modals = "Availability" | "Conditions" | "Location" | "Price" | "Public" | "Themes";

const LeftSidebarEdition = () => {
  const [showModal, setShowModal] = useState<Modals | null>(null);
  const toggleModal = useCallback(() => setShowModal((o) => null), []);

  return (
    <div>
      <AddContentButton onClick={() => setShowModal("Themes")} className="mb-6" size="md">
        <EVAIcon name="color-palette-outline" size={24} fill={styles.lightTextDisabledGrey} className="me-2" />
        Thèmes
      </AddContentButton>
      <AddContentButton onClick={() => {}} size="md">
        Nom de l'action
      </AddContentButton>

      <p className={styles.title}>C'est pour qui ?</p>
      <AddContentButton onClick={() => setShowModal("Public")} className="mb-6" size="md">
        Public visé
      </AddContentButton>
      <AddContentButton onClick={() => setShowModal("Price")} className="mb-6" size="md">
        Prix
      </AddContentButton>
      <AddContentButton onClick={() => {}} className="mb-6" size="md">
        Formation certifiante
      </AddContentButton>
      <AddContentButton onClick={() => setShowModal("Availability")} className="mb-6" size="md">
        Disponibilité demandée
      </AddContentButton>
      <AddContentButton onClick={() => setShowModal("Conditions")} className="mb-6" size="md">
        Conditions
      </AddContentButton>
      <AddContentButton onClick={() => setShowModal("Location")} className="mb-6" size="md">
        Zone d'action
      </AddContentButton>

      <p className={styles.title}>Responsabilité</p>
      <AddContentButton onClick={() => {}} size="md">
        Ajouter ma structure
      </AddContentButton>

      <ModalAvailability show={showModal === "Availability"} toggle={toggleModal} />
      <ModalConditions show={showModal === "Conditions"} toggle={toggleModal} />
      <ModalLocation show={showModal === "Location"} toggle={toggleModal} />
      <ModalPrice show={showModal === "Price"} toggle={toggleModal} />
      <ModalPublic show={showModal === "Public"} toggle={toggleModal} />
      <ModalThemes show={showModal === "Themes"} toggle={toggleModal} />
    </div>
  );
};

export default LeftSidebarEdition;
