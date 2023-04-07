import React from "react";
import Image from "next/image";
import { useLanguages } from "hooks";
import Flag from "components/UI/Flag";
import BubbleFlag from "assets/dispositif/bubble-flag.svg";
import styles from "./BubbleFlags.module.scss";

const BubbleFlags = () => {
  const { langues } = useLanguages();
  return (
    <div className={styles.container}>
      {langues.map((ln) => (
        <div key={ln.i18nCode} className={styles.item}>
          <Image src={BubbleFlag} width={32} height={32} alt="" className={styles.background} />
          <Flag langueCode={ln.langueCode} className={styles.flag} />
        </div>
      ))}
    </div>
  );
};

export default BubbleFlags;
