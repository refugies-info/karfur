import React from "react";
import { Languages } from "@refugies-info/api-types";
import { useLanguages } from "hooks";
import BubbleFlag from "components/UI/BubbleFlag";
import styles from "./BubbleFlags.module.scss";

const BubbleFlags = () => {
  const { langues } = useLanguages();
  return (
    <div className={styles.container}>
      {langues.map((ln) => (
        <BubbleFlag key={ln.i18nCode} ln={ln.i18nCode as Languages} className="me-4" />
      ))}
    </div>
  );
};

export default BubbleFlags;
