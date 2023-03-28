import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import ContentSlider from "components/UI/ContentSlider";
import ContributorCard from "./ContributorCard";
import styles from "./Contributors.module.scss";

/**
 * List of contributors of the dispositif
 */
const Contributors = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const participants = useMemo(() => {
    return (dispositif?.participants || []).sort((a, b) => {
      if (a.roles?.includes("Admin")) return -1;
      if (b.roles?.includes("Admin")) return 1;
      return 0;
    });
  }, [dispositif?.participants]);

  return (
    <div className={styles.section}>
      <Container>
        <p className={styles.title}>{participants.length} contributeurs mobilisés</p>
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
