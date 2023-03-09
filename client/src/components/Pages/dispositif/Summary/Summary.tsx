import Link from "next/link";
import React from "react";
import styles from "./Summary.module.scss";

const Summary = () => {
  return (
    <div className={styles.card}>
      <p className={styles.title}>Sommaire</p>
      <ol>
        <li className={styles.item}>
          <Link href="#anchor-who">C'est pour qui ?</Link>
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
