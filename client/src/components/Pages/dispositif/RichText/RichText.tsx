import React, { useContext } from "react";
import PageContext from "utils/pageContext";
import { RichTextEdit } from "../Edition";
import Text from "../Text";
import styles from "./RichText.module.scss";

interface Props {
  id: string;
  value: string | undefined;
}

const RichText = (props: Props) => {
  const pageContext = useContext(PageContext);

  return (
    <div className={styles.content}>
      {pageContext.mode !== "edit" ? (
        <Text id={props.id} html>
          {props.value || ""}
        </Text>
      ) : (
        <RichTextEdit value={props.value} id={props.id} />
      )}
    </div>
  );
};

export default RichText;
