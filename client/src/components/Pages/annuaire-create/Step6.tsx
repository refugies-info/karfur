import React from "react";
import { ObjectId } from "mongodb";
import Link from "next/link";
import FButton from "components/UI/FButton/FButton";
import gif from "assets/annuaire/GIF-annuaire.gif";
import Image from "next/image";
import styles from "./Step6.module.scss";
import { getPath } from "routes";
import { useRouter } from "next/router";

interface Props {
  structureId: string | ObjectId;
}
export const Step6 = (props: Props) => {
  const router = useRouter();

  return (
    <div className="step6">
      <div style={{ marginTop: "24px" }}>
        <Image
          src={gif}
          width={700}
          height={344}
          alt=""
          objectFit="contain"
        />
      </div>
      <div className={styles.title}>
        Vos informations sont désormais disponibles dans l’annuaire des acteurs de
        l’intégration.
      </div>
      <Link
        href={{
          pathname: getPath("/annuaire/[id]", router.locale),
          query: {id: props.structureId.toString()}
        }}
        passHref
      >
        <FButton type="dark" name="eye-outline" tag="a">
          Voir ma structure dans l&apos;annuaire
        </FButton>
      </Link>
    </div>
  )
}
