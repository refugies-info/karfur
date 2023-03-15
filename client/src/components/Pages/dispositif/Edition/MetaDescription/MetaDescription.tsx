import { GetDispositifResponse } from "api-types";
import React, { useState } from "react";
import { useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { themeSelector } from "services/Themes/themes.selectors";
import SectionTitle from "../../SectionTitle";
import AddContentButton from "../AddContentButton";
import { ModalAbstract } from "../Modals";
import styles from "./MetaDescription.module.scss";

const MetaDescription = () => {
  const [showModal, setShowModal] = useState(false);
  const values = useWatch<GetDispositifResponse>();
  const theme = useSelector(themeSelector(values?.theme));

  return (
    <section className={styles.container}>
      <SectionTitle titleKey="abstract" />
      <AddContentButton onClick={() => setShowModal(true)}>Résumé en 1 phrase</AddContentButton>
      <ModalAbstract show={showModal} toggle={() => setShowModal((o) => !o)} />
    </section>
  );
};

export default MetaDescription;
