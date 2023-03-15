import React from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import ContentSlider from "components/UI/ContentSlider";
import ContributorCard from "./ContributorCard";
import styles from "./Contributors.module.scss";

const Contributors = () => {
  const dispositif = useSelector(selectedDispositifSelector);

  return (
    <div className={styles.section}>
      <Container>
        <p className={styles.title}>{(dispositif?.participants || []).length} contributeurs mobilisés</p>
        <ContentSlider
          cards={(dispositif?.participants || []).map((user, i) => (
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
