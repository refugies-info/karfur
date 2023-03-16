import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import PageContext from "utils/pageContext";
import { TitleEdit } from "../Edition";
import Text from "../Text";
import styles from "./Title.module.scss";

interface Props {}

/**
 * Shows a text as title, or the form component of the Title. Can be used for VIEW or EDIT mode.
 */
const Title = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const pageContext = useContext(PageContext);

  return (
    <h1 className={styles.title}>
      {pageContext.mode !== "edit" ? (
        <Text id="titreInformatif">{dispositif?.titreInformatif || ""}</Text>
      ) : (
        <TitleEdit />
      )}
    </h1>
  );
};

export default Title;
