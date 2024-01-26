import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { useTranslation } from "next-i18next";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import ContentSlider from "components/UI/ContentSlider";
import ContributorCard from "./ContributorCard";
import styles from "./Contributors.module.scss";
import { RoleName } from "@refugies-info/api-types";

/**
 * List of contributors of the dispositif
 */
const Contributors = () => {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const participants = useMemo(() => {
    return (dispositif?.participants || []).sort((a, b) => {
      if (a.roles?.includes(RoleName.ADMIN)) return -1;
      if (b.roles?.includes(RoleName.ADMIN)) return 1;
      return 0;
    });
  }, [dispositif?.participants]);

  return (
    <div className={styles.section}>
      <Container>
        <p className={styles.title}>{t("Dispositif.contributors", { count: participants.length })}</p>
        <ContentSlider
          cards={participants.map((user, i) => (
            <ContributorCard key={i} user={user} />
          ))}
          gap={16}
          btnClassName={styles.slider_btn}
        />
      </Container>
    </div>
  );
};

export default Contributors;
