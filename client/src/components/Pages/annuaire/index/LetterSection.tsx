import React from "react";
import LinesEllipsis from "react-lines-ellipsis";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { ObjectId } from "mongodb";
import { Picture, SimplifiedStructure } from "types/interface";
import placeholder from "assets/no_results_alt.svg";
import styles from "./LetterSection.module.scss";
import { getPath } from "routes";
interface StructureCardProps {
  nom: string;
  acronyme: string;
  picture: Picture | null;
  id: ObjectId;
}
const StructureCard = (props: StructureCardProps) => {
  const router = useRouter();

  return (
    <Link
      legacyBehavior
      href={{
        pathname: getPath("/annuaire/[id]", router.locale),
        query: { id: props.id.toString() }
      }}
    >
      <a className={styles.structure_container}>
        <div className={styles.inner}>
          <Image
            className={styles.img}
            src={props.picture?.secure_url || placeholder}
            alt={props.nom}
            width={150}
            height={100}
          />
        </div>
        {!props.picture?.secure_url && <div></div>}

        <LinesEllipsis
          text={
            props.acronyme
              ? props.nom.length + props.acronyme.length > 43
                ? props.nom.substr(0, 36 - props.acronyme.length) + "... (" + props.acronyme + ")"
                : props.nom + " (" + props.acronyme + ")"
              : props.nom
          }
          maxLine="4"
          trimRight
          basedOn="letters"
        />
      </a>
    </Link>
  );
};

interface Props {
  structures: SimplifiedStructure[];
}
export const LetterSection = (props: Props) => {
  return (
    <div className={styles.letter_container}>
      {(props.structures || []).map((structure, key) => (
        <div key={key} className={styles.list_item}>
          {key === 0 && <div id="A" key={"anchor_" + key} className={styles.anchor} />}

          {key > 1 && props.structures[key - 1].nom[0].toLowerCase() !== props.structures[key].nom[0].toLowerCase() && (
            <>
              <div
                key={"anchor_" + props.structures[key].nom[0].toUpperCase()}
                className={styles.anchor}
                id={props.structures[key].nom[0].toUpperCase()}
              />
            </>
          )}
          <StructureCard
            key={"structure_" + key}
            nom={structure.nom}
            picture={structure.picture || null}
            acronyme={structure.acronyme}
            id={structure._id}
          />
        </div>
      ))}
    </div>
  );
};
