import React, { useContext } from "react";
import PageContext from "utils/pageContext";
import { TitleEdit } from "../Edition";
import Text from "../Text";
import styles from "./Title.module.scss";

interface Props {
  children: string;
}

const Title = (props: Props) => {
  const pageContext = useContext(PageContext);

  return (
    <h1 className={styles.title}>
      {pageContext.mode !== "edit" ? (
        <Text id="titreInformatif">{props.children}</Text>
      ) : (
        <TitleEdit id="titreInformatif" />
      )}
    </h1>
  );
};

export default Title;