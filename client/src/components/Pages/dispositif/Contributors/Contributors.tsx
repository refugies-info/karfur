import React from "react";
import { GetDispositifResponse } from "api-types";
import { Container } from "reactstrap";
import ContentSlider from "components/UI/ContentSlider";
import ContributorCard from "./ContributorCard";
import styles from "./Contributors.module.scss";

interface Props {
  contributors: GetDispositifResponse["participants"];
}

const Contributors = (props: Props) => {
  return (
    <div className={styles.section}>
      <Container>
        <p className={styles.title}>{props.contributors.length} contributeurs mobilisés</p>
        <ContentSlider
          cards={props.contributors.map((user, i) => (
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
