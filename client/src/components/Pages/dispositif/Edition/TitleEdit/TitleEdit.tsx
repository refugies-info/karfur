import React, { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ContentType } from "api-types";
import PageContext from "utils/pageContext";
import AddContentButton from "../AddContentButton";
import styles from "./TitleEdit.module.scss";

interface Props {}

/**
 * Form component for a title (titreInformatif and titreMarque).
 * Shows either an AddContentButton if the section in not active, or an input if it is.
 */
const TitleEdit = (props: Props) => {
  const [isTitleActive, setIsTitleActive] = useState(false);
  const [isActionActive, setIsActionActive] = useState(false);
  const formContext = useFormContext();

  const pageContext = useContext(PageContext);
  useEffect(() => {
    if (isTitleActive) pageContext.setActiveSection?.("titreInformatif");
    if (isActionActive) pageContext.setActiveSection?.("titreMarque");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTitleActive, isActionActive]);

  return (
    <div>
      {!isTitleActive && (
        <AddContentButton
          onClick={() => setIsTitleActive(true)}
          size="xl"
          content={formContext.getValues("titreInformatif")}
        >
          Titre de la fiche
        </AddContentButton>
      )}
      {isTitleActive && (
        <input
          type="text"
          {...formContext.register("titreInformatif")}
          onBlur={() => setIsTitleActive(false)}
          className={styles.input}
          autoFocus
        />
      )}

      {formContext.getValues("typeContenu") === ContentType.DISPOSITIF && (
        <div className={styles.marque}>
          <span className="me-6">Avec</span>
          {!isActionActive && (
            <AddContentButton
              onClick={() => setIsActionActive(true)}
              size="lg"
              content={formContext.getValues("titreMarque")}
            >
              Nom de l'action
            </AddContentButton>
          )}
          {isActionActive && (
            <input
              type="text"
              {...formContext.register("titreMarque")}
              onBlur={() => setIsActionActive(false)}
              className={styles.input}
              autoFocus
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TitleEdit;
