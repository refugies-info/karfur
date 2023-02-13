import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import PageContext from "utils/pageContext";
import styles from "./RichTextInput.module.scss";

interface Props {
  id: string;
  value: string;
}

const RichTextInput = (props: Props) => {
  const pageContext = useContext(PageContext);
  const formContext = useFormContext();

  return (
    <>
      {pageContext.mode !== "edit" ? (
        <p
          dangerouslySetInnerHTML={{ __html: props.value }}
          className={pageContext.activeSection === props.id ? styles.highlighted : ""}
        />
      ) : (
        <textarea {...formContext.register(props.id)} />
      )}
    </>
  );
};

export default RichTextInput;
