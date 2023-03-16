import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import PageContext from "utils/pageContext";
import AddContentButton from "../AddContentButton";
import styles from "./TitleEdit.module.scss";

interface Props {
  id: string;
}

const TitleEdit = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const formContext = useFormContext();
  const activateField = useCallback(() => setIsActive(true), []);
  const onFocusOut = useCallback(() => setIsActive(false), []);

  const pageContext = useContext(PageContext);
  useEffect(() => {
    pageContext.setActiveSection?.(isActive ? props.id : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, props.id]);

  return (
    <div>
      {!isActive && (
        <AddContentButton onClick={activateField} size="xl" content={formContext.getValues(props.id)}>
          Titre
        </AddContentButton>
      )}
      {isActive && (
        <input type="text" {...formContext.register(props.id)} onBlur={onFocusOut} className={styles.input} autoFocus />
      )}
    </div>
  );
};

export default TitleEdit;
