import React from "react";
import Image from "next/image";
import { StyledStatus } from "./SubComponents";
import { cls } from "lib/classname";
import noStructure from "assets/noStructure.png";
import styles from "../Admin.module.scss";
import { ContentStructure, UserStructure } from "api-types";

export const StructureButton = (props: {
  sponsor: UserStructure | ContentStructure | null;
  onClick: () => void;
  additionnalProp: "status" | "role";
}) => {
  const additionnalProp = props.additionnalProp || "status";
  const propsToDisplay =
    additionnalProp === "status"
      ? (props.sponsor as ContentStructure).status || ""
      : (props.sponsor as UserStructure)?.role?.[0] || "";

  return (
    <div className={styles.details_button} onClick={props.onClick}>
      {props.sponsor?.picture?.secure_url ? (
        <Image
          className={styles.sponsor_img}
          src={(props.sponsor.picture || {}).secure_url || ""}
          alt={props.sponsor.nom}
          width={95}
          height={30}
          style={{ objectFit: "contain" }}
        />
      ) : (
        <Image className={styles.sponsor_img} src={noStructure} alt="no structure" />
      )}
      <p className={cls(styles.text, "ms-1")}>{props.sponsor ? props.sponsor.nom : "Aucune structure définie !"}</p>
      {props.sponsor && (
        <span className="ms-auto">
          <StyledStatus text={propsToDisplay} textToDisplay={propsToDisplay} disabled={true} />
        </span>
      )}
    </div>
  );
};
