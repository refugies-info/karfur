import React from "react";
import Image from "next/image";
import { SimplifiedMainSponsor, SimplifiedStructure } from "types/interface";
import { StyledStatus } from "./SubComponents";
import { cls } from "lib/classname";
import noStructure from "assets/noStructure.png";
import styles from "../Admin.module.scss";

export const StructureButton = (props: {
  sponsor: SimplifiedMainSponsor | SimplifiedStructure | null;
  onClick: () => void;
  additionnalProp: "status" | "role"
}) => {
  const additionnalProp = props.additionnalProp || "status";
  const propsToDisplay = additionnalProp === "status" ?
    (props.sponsor as SimplifiedMainSponsor).status || "" :
    (props.sponsor as SimplifiedStructure)?.role?.[0] || ""

  return (
    <div className={styles.details_button} onClick={props.onClick}>
      {props.sponsor?.picture?.secure_url ? (
        <Image
          className={styles.sponsor_img}
          src={(props.sponsor.picture || {}).secure_url}
          alt={props.sponsor.nom}
          width={95}
          height={30}
          objectFit="contain"
        />
      ) : (
        <Image
          className={styles.sponsor_img}
          src={noStructure}
          alt="no structure"
        />
      )}
      <p className={cls(styles.text, "ml-1")}>
        {props.sponsor ? props.sponsor.nom : "Aucune structure définie !"}
      </p>
      {props.sponsor && (
        <span className="ml-auto">
          <StyledStatus
            text={propsToDisplay}
            textToDisplay={propsToDisplay}
            disabled={true}
          />
        </span>
      )}
    </div>
  );
};
