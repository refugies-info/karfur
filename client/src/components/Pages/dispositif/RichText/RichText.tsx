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
    <>
      {pageContext.mode !== "edit" ? (
        <p
          dangerouslySetInnerHTML={{ __html: props.value }}
          className={pageContext.activeSection === props.id ? styles.highlighted : ""}
        />
      ) : (
        <RichTextInput value={props.value} id={props.id} />
      )}
    </>
  );
};

export default RichText;
