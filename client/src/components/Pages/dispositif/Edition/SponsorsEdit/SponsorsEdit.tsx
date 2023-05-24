import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CreateDispositifRequest } from "@refugies-info/api-types";
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
  const sponsors: CreateDispositifRequest["sponsors"] = useWatch({ name: "sponsors" });
  const { setValue } = useFormContext();

  return (
    <div id="step-sponsors" className={styles.container}>
      <Sponsors
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
        evaIcon="plus-circle-outline"
        priority="secondary"
        className={styles.add}
        onClick={(e: any) => {
          e.preventDefault();
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
