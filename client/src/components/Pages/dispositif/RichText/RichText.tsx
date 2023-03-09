import React, { useContext } from "react";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { cls } from "lib/classname";
import { getCalloutTranslationKey, translationParsing } from "lib/contentParsing";
import PageContext from "utils/pageContext";
import styles from "./RichText.module.scss";

const RichTextInput = dynamic(() => import("components/UI/RichTextInput"), { ssr: false });

interface Props {
  id: string;
  value: string;
}

const RichText = (props: Props) => {
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  const translatedHTML = translationParsing(props.value, [
    { nodeAttr: "data-callout='info'", translation: t(getCalloutTranslationKey("info")) },
    { nodeAttr: "data-callout='important'", translation: t(getCalloutTranslationKey("important")) },
  ]);

  return (
    <div className={styles.content}>
      {pageContext.mode !== "edit" ? (
        <div
          dangerouslySetInnerHTML={{ __html: translatedHTML }}
          className={cls(styles.content, pageContext.activeSection === props.id && styles.highlighted)}
        />
      ) : (
        <RichTextInput value={props.value} id={props.id} />
      )}
    </div>
  );
};

export default RichText;
