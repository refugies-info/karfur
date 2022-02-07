import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Image from "next/image";
import { Structure, Picture } from "types/interface";
import { StructureType } from "./StructureType";
import { SocialsLink } from "./SocialsLink";
import FButton from "components/FigmaUI/FButton/FButton";
import placeholder from "assets/annuaire/placeholder_logo_annuaire.svg";
import styles from "./LeftAnnuaireDetail.module.scss";


interface Props {
  structure: Structure | null;
  isLoading: boolean;
}

export const LeftAnnuaireDetail = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const getSecureUrl = (picture: Picture | null) => {
    if (picture && picture.secure_url) return picture.secure_url;

    return placeholder;
  };

  const onClickGoBack = () => {
    /* if (props.history.location.state === "from_annuaire_lecture") {
      // props.history.go(-1);
    } else { */
      router.push("/annuaire");
    // }
  };
  if (props.structure && !props.isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ marginBottom: "33px" }}>
          <FButton
            type="login"
            name="arrow-back-outline"
            onClick={onClickGoBack}
          >
            {t("Annuaire.Retour à l'annuaire", "Retour à l'annuaire")}
          </FButton>
        </div>
        <div>
          <div className={styles.logo}>
            <Image
              src={getSecureUrl(props.structure.picture)}
              alt={props.structure.acronyme}
              className={styles.image}
              width={232}
              height={150}
              objectFit="contain"
            />
          </div>
          {props.structure.structureTypes &&
            props.structure.structureTypes.map((structureType) => (
              <StructureType
                type={structureType}
                key={structureType}
              />
            ))}
        </div>
        <SocialsLink
          websites={props.structure.websites}
          facebook={props.structure.facebook}
          linkedin={props.structure.linkedin}
          twitter={props.structure.twitter}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logo}></div>
      </div>
    </div>
  );
};
