import React, { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ContentType } from "@refugies-info/api-types";
import { useContentType } from "hooks/dispositif";
import PageContext from "utils/pageContext";
import AddContentButton from "../AddContentButton";
import styles from "./TitleEdit.module.scss";

interface Props {}

/**
 * Form component for a title (titreInformatif and titreMarque).
 * Shows either an AddContentButton if the section in not active, or an input if it is.
 */
const TitleEdit = (props: Props) => {
  const typeContenu = useContentType();
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
    <div id="step-titreInformatif">
      {!isTitleActive && (
        <AddContentButton
          onClick={() => setIsTitleActive(true)}
          size="xl"
          content={formContext.getValues("titreInformatif")}
        >
          Titre informatif
        </AddContentButton>
      )}
      {isTitleActive && (
        <input
          type="text"
          {...formContext.register("titreInformatif")}
          onBlur={() => {
            pageContext.setActiveSection?.("");
            setIsTitleActive(false);
          }}
          className={styles.input}
          autoFocus
        />
      )}

      {typeContenu === ContentType.DISPOSITIF && (
        <div className={styles.marque} id="step-titreMarque">
          <span className="me-6">Avec</span>
          {!isActionActive && (
            <AddContentButton
              onClick={() => setIsActionActive(true)}
              size="lg"
              content={formContext.getValues("titreMarque")}
            >
              Nom de votre action
            </AddContentButton>
          )}
          {isActionActive && (
            <input
              type="text"
              {...formContext.register("titreMarque")}
              onBlur={() => {
                pageContext.setActiveSection?.("");
                setIsActionActive(false);
              }}
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
