import type { CreateDispositifRequest } from "@refugies-info/api-types";
import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { allStructuresSelector } from "~/services/AllStructures/allStructures.selector";
import Sponsors from "../../Sponsors";
import { ModalMainSponsor, ModalSponsors } from "../Modals";
import DeleteContentModal from "./DeleteContentModal";
import styles from "./SponsorsEdit.module.scss";

/**
 * Show secondary sponsors of a dispositif in EDIT mode.
 */
const SponsorsEdit = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMainSponsorModal, setShowMainSponsorModal] = useState(false);
  const [toDeleteItemModal, setToDeleteItemModal] = useState(-1); // -1 closed, else show modal and save index to delete
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(-1);
  const sponsors: CreateDispositifRequest["sponsors"] = useWatch({
    name: "sponsors",
  });
  const rawMainSponsor: CreateDispositifRequest["mainSponsor"] = useWatch({
    name: "mainSponsor",
  });
  const { setValue } = useFormContext();

  const structures = useSelector(allStructuresSelector);

  // Transform mainSponsor from string ID to object if needed
  const mainSponsor = useMemo(() => {
    if (typeof rawMainSponsor === "string") {
      const sponsor = structures.find((s) => s._id.toString() === rawMainSponsor);
      return sponsor
        ? {
            _id: sponsor._id,
            nom: sponsor.nom,
            picture: sponsor.picture,
            acronyme: sponsor.acronyme,
            link: sponsor.link,
          }
        : null;
    }
    return rawMainSponsor;
  }, [rawMainSponsor, structures]);

  // Transform sponsors strings to objects for display
  const displayedSponsors = useMemo(() => {
    return sponsors
      ?.map((s) => {
        if (typeof s === "string") {
          const structure = structures.find((params) => params._id.toString() === s);
          if (!structure) {
            console.warn(`Sponsor structure with id ${s} not found.`);
            return null;
          }
          return structure;
        }
        return s;
      })
      .filter((s) => s !== null);
  }, [sponsors, structures]);

  return (
    <div id="step-sponsors" className={styles.container}>
      <Sponsors
        sponsors={displayedSponsors}
        mainSponsor={mainSponsor}
        onMainSponsorClick={() => setShowMainSponsorModal(true)}
        editMode
        onClick={(idx) => {
          setCurrentSponsorIndex(idx);
          setShowModal(true);
        }}
        onDelete={(idx) => {
          setToDeleteItemModal(idx);
        }}
        onAdd={() => {
          setCurrentSponsorIndex(-1);
          setShowModal(true);
        }}
      />
      <ModalSponsors
        show={showModal}
        toggle={() => setShowModal((o) => !o)}
        currentSponsorIndex={currentSponsorIndex}
      />
      <ModalMainSponsor
        show={showMainSponsorModal}
        toggle={() => setShowMainSponsorModal((o) => !o)}
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
