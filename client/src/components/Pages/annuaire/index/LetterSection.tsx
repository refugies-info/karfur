import React from "react";
import LinesEllipsis from "react-lines-ellipsis";
import { ObjectId } from "mongodb";
import { Picture, SimplifiedStructure } from "types/interface";
import placeholder from "assets/annuaire/placeholder_logo_annuaire.svg";
import styles from "./LetterSection.module.scss";
import Image from "next/image";

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
  return (
    <div
      className={styles.structure_container}
      onClick={() => props.onStructureCardClick(props.id)}
    >
      <div className={styles.inner}>
        <Image
          className={styles.img}
          src={props.picture?.secure_url || placeholder}
          alt={props.acronyme}
          width={150}
          height={100}
        />
      </div>
      {(!props?.picture?.secure_url) && <div></div>}

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
      {(props.structures || []).map((structure, key) => (
          <>
            {key === 0 &&
              <div id="A" key={key} className={styles.anchor} />
            }

            {key > 1 && // @ts-ignore
              props.structures[key - 1].nom[0].toLowerCase() !==
                props.structures[key].nom[0].toLowerCase() && (
                <>
                <div
                  key={props.structures[key].nom[0].toUpperCase()}
                    className={styles.anchor}
                    id={props.structures[key].nom[0].toUpperCase()}
                  />
                </>
              )}
          <StructureCard
            key={key}
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
