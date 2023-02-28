import { InfoSections } from "api-types";
import React from "react";
import RichText from "../RichText";
import TextInput from "../TextInput";
import styles from "./Accordions.module.scss";

interface Props {
  content: InfoSections | undefined;
  sectionKey: string;
  color: string;
}

const Accordions = ({ content, sectionKey, color }: Props) => {
  return (
    <div>
      {content ? (
        <>
          {Object.entries(content).map((section) => (
            <div key={section[0]}>
              <h2 className={styles.title} style={{ color }}>
                <TextInput id={`${sectionKey}.${section[0]}.title`} value={section[1].title} />
              </h2>
              <RichText id={`${sectionKey}.${section[0]}.text`} value={section[1].text} />
            </div>
          ))}
        </>
      ) : (
        <>
          <div>
            <h2 className={styles.title}>
              <TextInput id={`${sectionKey}.a.title`} value={""} />
            </h2>
            <RichText id={`${sectionKey}.a.text`} value={""} />
          </div>
        </>
      )}
    </div>
  );
};

export default Accordions;
