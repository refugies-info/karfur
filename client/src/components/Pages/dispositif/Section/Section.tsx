import { InfoSections } from "api-types";
import React from "react";
import { getSectionTitle } from "./functions";
import Accordions from "../Accordions";
import RichText from "../RichText";
import styles from "./Section.module.scss";

interface Props {
  accordions?: InfoSections;
  content?: string;
  sectionKey: string;
  color: string;
}

const Section = ({ content, sectionKey, color, accordions }: Props) => {
  return (
    <section className={styles.container}>
      <p className={styles.title} style={{ color }}>
        {getSectionTitle(sectionKey)}
      </p>
      {content && <RichText id={sectionKey} value={content} />}
      {accordions && <Accordions content={accordions} sectionKey={sectionKey} color={color} />}
    </section>
  );
};

export default Section;
