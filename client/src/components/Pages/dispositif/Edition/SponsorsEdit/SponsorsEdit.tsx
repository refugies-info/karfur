import React, { useState } from "react";
import { useWatch } from "react-hook-form";
import { CreateDispositifRequest } from "api-types";
import Button from "components/UI/Button";
import { ModalSponsors } from "../Modals";
import Sponsors from "../../Sponsors";
import styles from "./SponsorsEdit.module.scss";

/**
 * Show secondary sponsors of a dispositif in EDIT mode.
 */
const SponsorsEdit = () => {
  const [showModal, setShowModal] = useState(false);
  // FIXME : ts error
  //@ts-ignore
  const sponsors = useWatch<CreateDispositifRequest["sponsors"]>({ name: "sponsors", default: [] });

  return (
    <div className={styles.container}>
      {/* FIXME */}
      {/* @ts-ignore */}
      <Sponsors sponsors={sponsors} editMode />

      <Button icon="plus-circle-outline" secondary className={styles.add} onClick={() => setShowModal(true)}>
        Ajouter un partenaire
      </Button>
      <ModalSponsors show={showModal} toggle={() => setShowModal((o) => !o)} />
    </div>
  );
};

export default SponsorsEdit;
