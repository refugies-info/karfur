import React, { useContext } from "react";
import PageContext from "utils/pageContext";
import { RichTextEdit } from "../Edition";
import Text from "../Text";
import styles from "./RichText.module.scss";

interface Props {
  id: string;
  value: string | undefined;
}

/**
 * Shows a rich text as html, or the form component of the RichText. Can be used for VIEW or EDIT mode.
 */
const RichText = (props: Props) => {
  const pageContext = useContext(PageContext);

  return (
    <div className={styles.content}>
      {pageContext.mode !== "edit" ? (
        <Text id={props.id} html>
          {props.value || ""}
        </Text>
      ) : (
        <RichTextEdit id={props.id} />
      )}
    </div>
  );
};

export default RichText;
