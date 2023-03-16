import React, { useContext } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { ContentStructure, Sponsor } from "api-types";
import PageContext from "utils/pageContext";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import styles from "./Sponsors.module.scss";

/**
 * Show secondary sponsors of a dispositif. Can be used in VIEW or EDIT mode.
 */
const Sponsors = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const pageContext = useContext(PageContext);
  const hasSponsors = dispositif?.sponsors && dispositif.sponsors.length > 0;
  const isEditMode = pageContext.mode === "edit";

  return hasSponsors || isEditMode ? (
    <div className={styles.container}>
      <span className={styles.label}>En partenariat avec</span>
      <div className={styles.sponsors}>
        {(dispositif?.sponsors || [])?.map((sponsor, i) => {
          const image =
            (sponsor as Sponsor).logo?.secure_url || (sponsor as ContentStructure).picture?.secure_url || "";
          const name = (sponsor as Sponsor).name || (sponsor as ContentStructure).nom || "";
          return (
            <div key={i} className={styles.sponsor}>
              <Image src={image} alt={name} width={40} height={40} style={{ objectFit: "contain" }} className="me-3" />
              <div>{name}</div>
            </div>
          );
        })}
      </div>

      {isEditMode && (
        <Button icon="plus-circle-outline" secondary className={styles.add}>
          Ajouter un partenaire
        </Button>
      )}
    </div>
  ) : null;
};

export default Sponsors;
