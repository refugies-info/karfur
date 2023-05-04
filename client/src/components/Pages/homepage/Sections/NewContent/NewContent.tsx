import React from "react";
import { Button, Container } from "reactstrap";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { cls } from "lib/classname";
import { getPath } from "routes";
import CardSlider from "components/Pages/recherche/CardSlider";
import commonStyles from "scss/components/staticPages.module.scss";
import styles from "./NewContent.module.scss";
import { ContentType, GetDispositifsResponse } from "api-types";

interface Props {
  nbDemarches: number;
  nbDispositifs: number;
  nbStructures: number;
  demarches: GetDispositifsResponse[];
  dispositifs: GetDispositifsResponse[];
}

const NewContent = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const navigateType = (type: string) => {
    router.push({
      pathname: getPath("/recherche", router.locale),
      query: {
        type: type,
      },
    });
  };

  return (
    <div className={cls(commonStyles.section, commonStyles.bg_grey, styles.sliders)}>
      <Container className={commonStyles.container}>
        <h2 className={commonStyles.title2}>{t("Homepage.infoTypeTitle")}</h2>
        <div className={styles.title}>
          <h2 className="h4">{t("Homepage.infoTypeDemarche", { count: props.nbDemarches })}</h2>
          <Button onClick={() => navigateType("demarche")}>{t("Recherche.seeAllButton", "Voir tout")}</Button>
        </div>
        <CardSlider cards={props.demarches} type={ContentType.DEMARCHE} />
        <div className={styles.title}>
          <h2 className="h4">
            {t("Homepage.infoTypeDispositif", {
              countDispositifs: props.nbDispositifs,
              countStructures: props.nbStructures,
            })}
          </h2>
          <Button onClick={() => navigateType("dispositif")}>{t("Recherche.seeAllButton", "Voir tout")}</Button>
        </div>
        <CardSlider cards={props.dispositifs} type={ContentType.DISPOSITIF} />
      </Container>
    </div>
  );
};

export default NewContent;
