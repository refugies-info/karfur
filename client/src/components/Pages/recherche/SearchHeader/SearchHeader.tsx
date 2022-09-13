import React from "react";
import { cls } from "lib/classname";
import styles from "./SearchHeader.module.scss";
import { Container } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";

interface Props {}

const SearchHeader = (props: Props) => {
  return (
    <div className={styles.container}>

      <Container>
        <h1 className="h3 text-white">135 fiches disponibles pour votre recherche</h1>
        <div className={styles.filters}>
          <button className={styles.filter}>
            <span className={styles.icon}>
              <EVAIcon
                name="pin-outline"
                fill="black"
                size="large"
              />
            </span>
            <span>
              <span className={styles.label}>Département</span>
              <span className={styles.value}>Tous</span>
            </span>
          </button>

          <button className={styles.filter}>
            <span className={styles.icon}>
              <EVAIcon
                name="list-outline"
                fill="black"
                size="large"
              />
            </span>
            <span>
              <span className={styles.label}>Thèmes</span>
              <span className={styles.value}>Tous</span>
            </span>
          </button>

          <div className={styles.filter}>
            <span className={styles.icon}>
              <EVAIcon
                name="search-outline"
                fill="black"
                size="large"
              />
            </span>
            <span>
              <label className={styles.label}>Mot-clé</label>
              <input type="search" placeholder="Rechercher..." className={styles.input} />
            </span>
          </div>
        </div>
      </Container>

    </div>
  )
};

export default SearchHeader;
