import React, { useState } from "react";
import AddContentButton from "../AddContentButton";
import styles from "./MetaDescription.module.scss";

interface Props {
  content?: string;
  color: string;
}

const MetaDescription = ({ content, color }: Props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <section className={styles.container}>
      <p className={styles.title} style={{ color }}>
        Résumé
      </p>
      {!isActive && <AddContentButton onClick={() => setIsActive(true)}>Résumé en 1 phrase</AddContentButton>}
    </section>
  );
};

export default MetaDescription;
