import { GetStructureResponse, Picture } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { getPath, isRoute } from "routes";
import placeholder from "~/assets/no_results_alt.svg";
import FButton from "~/components/UI/FButton/FButton";
import styles from "./LeftAnnuaireDetail.module.scss";
import { SocialsLink } from "./SocialsLink";
import { StructureType } from "./StructureType";

interface Props {
  structure: GetStructureResponse | null;
  isLoading: boolean;
  history: string[];
}

export const LeftAnnuaireDetail = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const getSecureUrl = (picture: Picture | undefined) => {
    if (picture && picture.secure_url) return picture.secure_url;

    return placeholder;
  };

  const onClickGoBack = () => {
    if (props.history[1] && isRoute(props.history[1], "/annuaire")) {
      router.push(props.history[1]);
    } else {
      router.push(getPath("/annuaire", router.locale));
    }
  };
  if (props.structure && !props.isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ marginBottom: "33px" }}>
          <FButton type="login" name="arrow-back-outline" onClick={onClickGoBack}>
            {t("Annuaire.back", "Retour à l'annuaire")}
          </FButton>
        </div>
        <div>
          <div className={styles.logo}>
            <Image
              src={getSecureUrl(props.structure.picture)}
              alt={props.structure.nom}
              className={styles.img}
              width={232}
              height={150}
              style={{ objectFit: "contain" }}
            />
          </div>
          {props.structure.structureTypes &&
            props.structure.structureTypes.map((structureType) => (
              <StructureType type={structureType} key={structureType} />
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
