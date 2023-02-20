import { InfoSections } from "api-types";
import React from "react";
import RichTextInput from "../RichTextInput";
import TextInput from "../TextInput";
import { getSectionTitle } from "./functions";
import styles from "./Accordions.module.scss";

interface Props {
  content: InfoSections | undefined;
  sectionKey: string;
}

const Accordions = ({ content, sectionKey }: Props) => {
  return (
    <section>
      <p className="h2">{getSectionTitle(sectionKey)}</p>
      {content ? (
        <>
          {Object.entries(content).map((section) => (
            <div key={section[0]}>
              <h2 className={styles.title}>
                <TextInput id={`${sectionKey}.${section[0]}.title`} value={section[1].title} />
              </h2>
              <RichTextInput id={`${sectionKey}.${section[0]}.text`} value={section[1].text} />
            </div>
          ))}
        </>
      ) : (
        <>
          <div>
            <h2 className={styles.title}>
              <TextInput id={`${sectionKey}.a.title`} value={""} />
            </h2>
            <RichTextInput id={`${sectionKey}.a.text`} value={""} />
          </div>
        </>
      )}
    </section>
  );
};

export default Accordions;
