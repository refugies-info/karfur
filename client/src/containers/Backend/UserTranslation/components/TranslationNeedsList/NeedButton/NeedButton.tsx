import React from "react";
import Image from "next/image";
import { Languages } from "@refugies-info/api-types";
import { cls } from "lib/classname";
import TranslationStatus from "components/Pages/dispositif/Translation/TranslationInput/TranslationStatus";
import { getClassStatus } from "./functions";
import { SortedNeed } from "../TranslationNeedsList";
import styles from "./NeedButton.module.scss";

interface Props {
  onClick: () => void;
  need: SortedNeed;
  langueI18nCode: Languages;
}

const NeedButton = (props: Props) => {
  const classStatus = getClassStatus(props.need.status);
  return (
    <button onClick={props.onClick} className={cls(styles.need, styles[classStatus])}>
      <div className={styles.content}>
        {props.need.image?.secure_url && (
          <div className="me-4">
            <Image src={props.need.image?.secure_url} width={30} height={30} alt="" />
          </div>
        )}
        <p className="mb-0">
          <span className={styles.title}>{props.need[props.langueI18nCode]?.text || props.need.fr.text}</span>
          <span className={styles.subtitle}>
            {props.need[props.langueI18nCode]?.subtitle || props.need.fr.subtitle}
          </span>
        </p>
      </div>
      <TranslationStatus status={props.need.status} />
    </button>
  );
};

export default NeedButton;
