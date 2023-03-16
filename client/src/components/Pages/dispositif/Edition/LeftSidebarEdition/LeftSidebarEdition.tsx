import React, { useCallback, useState } from "react";
import { useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { themeSelector } from "services/Themes/themes.selectors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { ContentType, GetDispositifResponse } from "api-types";
import {
  ModalAbstract,
  ModalAvailability,
  ModalConditions,
  ModalLocation,
  ModalPrice,
  ModalPublic,
  ModalThemes,
} from "../Modals";
import AddContentButton from "../AddContentButton";
import CardPrice from "../../Metadatas/CardPrice";
import CardLocation from "../../Metadatas/CardLocation";
import CardPublic from "../../Metadatas/CardPublic";
import CardAvailability from "../../Metadatas/CardAvailability";
import CardConditions from "../../Metadatas/CardConditions";
import CardTheme from "../../Metadatas/CardTheme";
import { cls } from "lib/classname";
import styles from "./LeftSidebarEdition.module.scss";

type Modals = "Availability" | "Conditions" | "Location" | "Price" | "Public" | "Themes" | "Abstract";

/**
 * Left sidebar of the page in EDIT mode.
 * For each section, it shows either an AddContentButton if no content yet, or a card if the value is set.
 */
const LeftSidebarEdition = () => {
  const values = useWatch<GetDispositifResponse>();
  const [showModal, setShowModal] = useState<Modals | null>(null);
  const toggleModal = useCallback(() => setShowModal((o) => null), []);
  const currentTheme = useSelector(themeSelector(values.theme));
  const color = currentTheme?.colors.color100 || "#000";

  return (
    <div className={styles.container}>
      {values.theme !== undefined ? (
        <CardTheme
          dataTheme={values.theme}
          dataSecondaryThemes={values.secondaryThemes}
          color={color}
          onClick={() => setShowModal("Themes")}
        />
      ) : (
        <AddContentButton onClick={() => setShowModal("Themes")} className="mb-6" size="md">
          <EVAIcon
            name="color-palette-outline"
            size={24}
            fill={styles.lightTextDisabledGrey}
            className={cls(styles.theme_icon, "me-2")}
          />
          Thèmes
        </AddContentButton>
      )}

      <p className={styles.title}>C'est pour qui ?</p>

      {values.metadatas?.publicStatus !== undefined ||
      values.metadatas?.age !== undefined ||
      values.metadatas?.frenchLevel !== undefined ||
      values.metadatas?.public !== undefined ? (
        <CardPublic
          dataPublicStatus={values.metadatas.publicStatus}
          /* @ts-ignore FIXME */
          dataAge={values.metadatas.age}
          dataFrenchLevel={values.metadatas.frenchLevel}
          dataPublic={values.metadatas.public}
          color={color}
          onClick={() => setShowModal("Public")}
        />
      ) : (
        <AddContentButton onClick={() => setShowModal("Public")} className="mb-6" size="md">
          Public visé
        </AddContentButton>
      )}

      {values.metadatas?.price !== undefined ? (
        /* @ts-ignore FIXME */
        <CardPrice data={values.metadatas.price} color={color} onClick={() => setShowModal("Price")} />
      ) : (
        <AddContentButton onClick={() => setShowModal("Price")} className="mb-6" size="md">
          Prix
        </AddContentButton>
      )}

      {values.metadatas?.commitment !== undefined ||
      values.metadatas?.frequency !== undefined ||
      values.metadatas?.timeSlots !== undefined ? (
        <CardAvailability
          /* @ts-ignore FIXME */
          dataCommitment={values.metadatas.commitment}
          /* @ts-ignore FIXME */
          dataFrequency={values.metadatas.frequency}
          dataTimeSlots={values.metadatas.timeSlots}
          color={color}
          onClick={() => setShowModal("Availability")}
        />
      ) : (
        <AddContentButton onClick={() => setShowModal("Availability")} className="mb-6" size="md">
          Disponibilité demandée
        </AddContentButton>
      )}

      {values.metadatas?.conditions !== undefined ? (
        <CardConditions data={values.metadatas.conditions} color={color} onClick={() => setShowModal("Conditions")} />
      ) : (
        <AddContentButton onClick={() => setShowModal("Conditions")} className="mb-6" size="md">
          Conditions
        </AddContentButton>
      )}

      {values.metadatas?.location !== undefined ? (
        <CardLocation
          data={values.metadatas.location}
          typeContenu={values.typeContenu || ContentType.DISPOSITIF}
          color={color}
          onClick={() => setShowModal("Location")}
        />
      ) : (
        <AddContentButton onClick={() => setShowModal("Location")} className="mb-6" size="md">
          Zone d'action
        </AddContentButton>
      )}

      <p className={styles.title}>À faire en dernier</p>
      <AddContentButton onClick={() => {}} size="md" className="mb-6">
        <EVAIcon
          name="home-outline"
          size={24}
          fill={styles.lightTextDisabledGrey}
          className={cls(styles.theme_icon, "me-2")}
        />
        Structure
      </AddContentButton>

      <AddContentButton onClick={() => setShowModal("Abstract")} size="md" contentSize="sm" content={values.abstract}>
        <EVAIcon
          name="file-text-outline"
          size={24}
          fill={styles.lightTextDisabledGrey}
          className={cls(styles.theme_icon, "me-2")}
        />
        Résumé
      </AddContentButton>

      <ModalAvailability show={showModal === "Availability"} toggle={toggleModal} />
      <ModalConditions show={showModal === "Conditions"} toggle={toggleModal} />
      <ModalLocation show={showModal === "Location"} toggle={toggleModal} />
      <ModalPrice show={showModal === "Price"} toggle={toggleModal} />
      <ModalPublic show={showModal === "Public"} toggle={toggleModal} />
      <ModalThemes show={showModal === "Themes"} toggle={toggleModal} />
      <ModalAbstract show={showModal === "Abstract"} toggle={toggleModal} />
    </div>
  );
};

export default LeftSidebarEdition;
