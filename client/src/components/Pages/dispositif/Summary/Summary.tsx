import Link from "next/link";
import React from "react";
import styles from "./Summary.module.scss";

/**
 * Summary for mobile version
 */
const Summary = () => {
  return (
    <div className={styles.card}>
      <p className={styles.title}>Sommaire</p>
      <ol>
        <li className={styles.item}>
          <Link href="#anchor-who">Informations importantes</Link>
        </li>
        <li className={styles.item}>
          <Link href="#anchor-what">C'est quoi et pourquoi c'est intéressant ?</Link>
        </li>
        <li className={styles.item}>
          <Link href="#anchor-how">Comment faire ?</Link>
        </li>
      </ol>
    </div>
  );
};

export default Summary;
