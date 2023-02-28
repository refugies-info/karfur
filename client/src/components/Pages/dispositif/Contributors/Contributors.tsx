import React from "react";
import { GetDispositifResponse } from "api-types";
import { Container } from "reactstrap";
import styles from "./Contributors.module.scss";
import ContributorCard from "./ContributorCard";

interface Props {
  contributors: GetDispositifResponse["participants"];
}

const Contributors = (props: Props) => {
  return (
    <div className={styles.section}>
      <Container>
        <p className={styles.title}>{props.contributors.length} contributeurs mobilisés</p>
        <div className={styles.row}>
          {props.contributors.map((user, i) => (
            <ContributorCard key={i} user={user} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Contributors;
