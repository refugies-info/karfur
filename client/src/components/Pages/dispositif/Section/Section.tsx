import React from "react";
import { ContentType, InfoSections } from "api-types";
import { getSectionTitle } from "./functions";
import Accordions from "../Accordions";
import RichText from "../RichText";
import SectionButtons from "../SectionButtons";
import styles from "./Section.module.scss";

interface Props {
  accordions?: InfoSections;
  content?: string;
  sectionKey: string;
  color100: string;
  color30: string;
  contentType?: ContentType;
}

const Section = ({ content, sectionKey, color100, color30, accordions, contentType }: Props) => {
  return (
    <section className={styles.container} id={`anchor-${sectionKey}`}>
      <p className={styles.title} style={{ color: color100 }}>
        {getSectionTitle(sectionKey)}
      </p>
      {content && (
        <>
          <RichText id={sectionKey} value={content} />
          <SectionButtons id={sectionKey} content={{ title: getSectionTitle(sectionKey), text: content }} />
        </>
      )}
      {accordions && (
        <Accordions
          content={accordions}
          sectionKey={sectionKey}
          color100={color100}
          color30={color30}
          withNumber={contentType === ContentType.DEMARCHE}
        />
      )}
    </section>
  );
};

export default Section;
