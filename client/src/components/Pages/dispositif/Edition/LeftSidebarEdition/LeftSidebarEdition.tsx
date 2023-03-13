import React, { useCallback, useState } from "react";
import { useWatch } from "react-hook-form";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { ContentType, GetDispositifResponse } from "api-types";
import { ModalAvailability, ModalConditions, ModalLocation, ModalPrice, ModalPublic, ModalThemes } from "../Modals";
import AddContentButton from "../AddContentButton";
import CardPrice from "../../Metadatas/CardPrice";
import CardLocation from "../../Metadatas/CardLocation";
import CardPublic from "../../Metadatas/CardPublic";
import styles from "./LeftSidebarEdition.module.scss";

type Modals = "Availability" | "Conditions" | "Location" | "Price" | "Public" | "Themes";

const LeftSidebarEdition = () => {
  const values = useWatch<GetDispositifResponse>();
  const [showModal, setShowModal] = useState<Modals | null>(null);
  const toggleModal = useCallback(() => setShowModal((o) => null), []);
  const color = "#000"; // TODO: set color

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
      {values.metadatas?.age !== undefined ||
      values.metadatas?.frenchLevel !== undefined ||
      values.metadatas?.public !== undefined ? (
        <CardPublic
          /* @ts-ignore FIXME */
          dataAge={values.metadatas.age}
          dataFrenchLevel={values.metadatas.frenchLevel}
          dataPublic={values.metadatas.public}
          color={color}
          status="done"
          onClick={() => setShowModal("Public")}
        />
      ) : (
        <AddContentButton onClick={() => setShowModal("Public")} className="mb-6" size="md">
          Public visé
        </AddContentButton>
      )}

      {values.metadatas?.price !== undefined ? (
        /* @ts-ignore FIXME */
        <CardPrice data={values.metadatas.price} color={color} status="done" onClick={() => setShowModal("Price")} />
      ) : (
        <AddContentButton onClick={() => setShowModal("Price")} className="mb-6" size="md">
          Prix
        </AddContentButton>
      )}

      <AddContentButton onClick={() => {}} className="mb-6" size="md">
        Formation certifiante
      </AddContentButton>
      <AddContentButton onClick={() => setShowModal("Availability")} className="mb-6" size="md">
        Disponibilité demandée
      </AddContentButton>
      <AddContentButton onClick={() => setShowModal("Conditions")} className="mb-6" size="md">
        Conditions
      </AddContentButton>

      {values.metadatas?.location !== undefined ? (
        <CardLocation
          data={values.metadatas.location}
          typeContenu={values.typeContenu || ContentType.DISPOSITIF}
          color={color}
          status="done"
          onClick={() => setShowModal("Location")}
        />
      ) : (
        <AddContentButton onClick={() => setShowModal("Location")} className="mb-6" size="md">
          Zone d'action
        </AddContentButton>
      )}

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
