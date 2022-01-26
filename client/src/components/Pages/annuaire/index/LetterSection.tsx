import React from "react";
import LinesEllipsis from "react-lines-ellipsis";
import { ObjectId } from "mongodb";
import { Picture, SimplifiedStructure } from "types/interface";
import placeholder from "assets/annuaire/placeholder_logo_annuaire.svg";
import styles from "./LetterSection.module.scss";

interface Props {
  structures: SimplifiedStructure[];
  onStructureCardClick: (id: ObjectId) => void;
}

interface StructureCardProps {
  nom: string;
  acronyme: string;
  picture: Picture;
  onStructureCardClick: (id: ObjectId) => void;
  id: ObjectId;
}
const StructureCard = (props: StructureCardProps) => {
  const getSecureUrl = (picture: Picture | null) => {
    if (picture && picture.secure_url) return picture.secure_url;

    return placeholder;
  };
  return (
    <div
      className={styles.structure_container}
      onClick={() => props.onStructureCardClick(props.id)}
    >
      <div className={styles.inner}>
        <img
          className={styles.img}
          src={getSecureUrl(props.picture)}
          alt={props.acronyme}
        />
      </div>
      {(!props.picture || !props.picture.secure_url) && <div></div>}

      <LinesEllipsis
        text={
          props.acronyme
            ? props.nom.length + props.acronyme.length > 43
              ? props.nom.substr(0, 36 - props.acronyme.length) +
                "... (" +
                props.acronyme +
                ")"
              : props.nom + " (" + props.acronyme + ")"
            : props.nom
        }
        maxLine="4"
        trimRight
        basedOn="letters"
      />
    </div>
  );
};

export const LetterSection = (props: Props) => {
  return (
    <div className={styles.letter_container}>
      {props.structures &&
        props.structures.map((structure, key) => (
          <>
            {key === 0 &&
              <div id="A" className={styles.anchor} />
            }

            {key > 1 && // @ts-ignore
              props.structures[key - 1].nom[0].toLowerCase() !==
                props.structures[key].nom[0].toLowerCase() && (
                <>
                  <div
                    className={styles.anchor}
                    id={props.structures[key].nom[0].toUpperCase()}
                  />
                </>
              )}
            <StructureCard
              key={structure.nom}
              nom={structure.nom}
              picture={structure.picture || {}}
              acronyme={structure.acronyme}
              onStructureCardClick={props.onStructureCardClick}
              id={structure._id}
            />
          </>
        ))}
    </div>
  );
};
