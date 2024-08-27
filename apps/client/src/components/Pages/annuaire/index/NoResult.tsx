import { useTranslation } from "next-i18next";
import Image from "next/image";
import NoResultsBackgroundImage from "~/assets/no_results.svg";
import FButton from "~/components/UI/FButton/FButton";
import styles from "./NoResult.module.scss";

export const NoResult = (props: any) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image src={NoResultsBackgroundImage} width={254} height={180} alt="No results" />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{t("no_result", "Aucun résultat")}</h2>
        <p className={styles.text}>
          {t(
            "Annuaire.retry_search",
            "Il n’existe aucune structure correspondant aux filtres sélectionnés. Essayez d’élargir votre recherche en retirant des filtres.",
          )}{" "}
        </p>
        <div className={styles.buttons}>
          <FButton type="dark" name="refresh-outline" className="me-2" onClick={props.resetAllFilter}>
            Recommencer
          </FButton>
        </div>
      </div>
    </div>
  );
};
