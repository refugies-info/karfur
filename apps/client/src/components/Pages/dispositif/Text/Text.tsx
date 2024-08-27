import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { cls } from "~/lib/classname";
import { getCalloutTranslationKey, translationParsing } from "~/lib/contentParsing";
import PageContext from "~/utils/pageContext";
import styles from "./Text.module.scss";

interface Props {
  id: string;
  children: string;
  html?: boolean;
}

/**
 * Displays a text (string or HTML) which can be highlighted
 */
const Text = (props: Props) => {
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  const convertedContent = props.html
    ? translationParsing(props.children || "", [
        { nodeAttr: /data-callout=["']info["']/, translation: t(getCalloutTranslationKey("info")) },
        { nodeAttr: /data-callout=["']important["']/, translation: t(getCalloutTranslationKey("important")) },
      ])
    : props.children;

  return props.html ? (
    <div
      data-section={props.id}
      dangerouslySetInnerHTML={{ __html: convertedContent }}
      className={cls(styles.content, pageContext.activeSection === props.id && styles.highlighted)}
    />
  ) : (
    <span className={pageContext.activeSection === props.id ? styles.highlighted : ""} data-section={props.id}>
      {convertedContent}
    </span>
  );
};

export default Text;
