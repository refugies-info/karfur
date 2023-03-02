import { cls } from "lib/classname";
import dynamic from "next/dynamic";
import React, { useContext } from "react";
import PageContext from "utils/pageContext";
import styles from "./RichText.module.scss";

const RichTextInput = dynamic(() => import("components/UI/RichTextInput"), { ssr: false });

interface Props {
  id: string;
  value: string;
}

const RichText = (props: Props) => {
  const pageContext = useContext(PageContext);

  return (
    <div className={styles.content}>
      {pageContext.mode !== "edit" ? (
        <div
          dangerouslySetInnerHTML={{ __html: props.value }}
          className={cls(styles.content, pageContext.activeSection === props.id && styles.highlighted)}
        />
      ) : (
        <RichTextInput value={props.value} id={props.id} />
      )}
    </div>
  );
};

export default RichText;