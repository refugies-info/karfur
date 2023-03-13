import React, { useState } from "react";
import AddContentButton from "../AddContentButton";
import { ModalAbstract } from "../Modals";
import styles from "./MetaDescription.module.scss";

interface Props {
  content?: string;
  color: string;
}

const MetaDescription = ({ content, color }: Props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className={styles.container}>
      <p className={styles.title} style={{ color }}>
        Résumé
      </p>
      <AddContentButton onClick={() => setShowModal(true)}>Résumé en 1 phrase</AddContentButton>
      <ModalAbstract show={showModal} toggle={() => setShowModal((o) => !o)} />
    </section>
  );
};

export default MetaDescription;
