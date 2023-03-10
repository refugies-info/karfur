import React, { useContext } from "react";
import PageContext from "utils/pageContext";
import { TitleEdit } from "../Edition";
import Text from "../Text";
import styles from "./Title.module.scss";

interface Props {
  id: string;
  children: string;
}

const Title = (props: Props) => {
  const pageContext = useContext(PageContext);

  return (
    <h1 className={styles.title}>
      {pageContext.mode !== "edit" ? (
        <Text id="titreInformatif">{props.children}</Text>
      ) : (
        <TitleEdit id={props.id} value={props.children} />
      )}
    </h1>
  );
};

export default Title;
