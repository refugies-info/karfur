import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import PageContext from "utils/pageContext";
import styles from "./TextInput.module.scss";

interface Props {
  id: string;
  value: string;
}

const TextInput = (props: Props) => {
  const pageContext = useContext(PageContext);
  const formContext = useFormContext();

  return (
    <>
      {pageContext.mode !== "edit" ? (
        <span className={pageContext.activeSection === props.id ? styles.highlighted : ""}>{props.value}</span>
      ) : (
        <input type="text" {...formContext.register(props.id)} />
      )}
    </>
  );
};

export default TextInput;
