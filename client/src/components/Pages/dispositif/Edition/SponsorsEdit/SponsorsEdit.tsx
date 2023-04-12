import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CreateDispositifRequest } from "api-types";
import Button from "components/UI/Button";
import { ModalSponsors } from "../Modals";
import Sponsors from "../../Sponsors";
import DeleteContentModal from "./DeleteContentModal";
import styles from "./SponsorsEdit.module.scss";

/**
 * Show secondary sponsors of a dispositif in EDIT mode.
 */
const SponsorsEdit = () => {
  const [showModal, setShowModal] = useState(false);
  const [toDeleteItemModal, setToDeleteItemModal] = useState(-1); // -1 closed, else show modal and save index to delete
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(-1);
  // FIXME : ts error
  //@ts-ignore
  const sponsors = useWatch<CreateDispositifRequest["sponsors"]>({ name: "sponsors", default: [] });
  const { setValue } = useFormContext();

  return (
    <div className={styles.container}>
      <Sponsors
        /* FIXME */
        /* @ts-ignore */
        sponsors={sponsors}
        editMode
        onClick={(idx) => {
          setCurrentSponsorIndex(idx);
          setShowModal(true);
        }}
        onDelete={(idx) => {
          setToDeleteItemModal(idx);
        }}
      />

      <Button
        icon="plus-circle-outline"
        secondary
        className={styles.add}
        onClick={() => {
          setCurrentSponsorIndex(-1);
          setShowModal(true);
        }}
      >
        Ajouter un partenaire
      </Button>
      <ModalSponsors
        show={showModal}
        toggle={() => setShowModal((o) => !o)}
        currentSponsorIndex={currentSponsorIndex}
      />
      <DeleteContentModal
        show={toDeleteItemModal > -1}
        toggle={() => setToDeleteItemModal(-1)}
        onValidate={() => {
          setValue(
            "sponsors",
            sponsors?.filter((s, i) => i !== toDeleteItemModal),
          );
          setToDeleteItemModal(-1);
        }}
      />
    </div>
  );
};

export default SponsorsEdit;
