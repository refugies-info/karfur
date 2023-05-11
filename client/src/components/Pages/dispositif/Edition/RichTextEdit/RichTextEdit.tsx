import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import { useEvent } from "hooks";
import PageContext from "utils/pageContext";
import Button from "components/UI/Button";
import AddContentButton from "../AddContentButton";
import styles from "./RichTextEdit.module.scss";

const RichTextInput = dynamic(() => import("components/UI/RichTextInput"), { ssr: false });

interface Props {
  id: string;
}

/**
 * Form component for a rich text.
 * Shows either an AddContentButton if the section in not active, or a the rich text editor if it is.
 */
const RichTextEdit = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const formContext = useFormContext();
  const { Event } = useEvent();

  const pageContext = useContext(PageContext);
  useEffect(() => {
    if (isActive) {
      pageContext.setActiveSection?.(props.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, props.id]);

  useEffect(() => {
    if (pageContext.activeSection !== props.id) {
      setIsActive(false);
    }
  }, [pageContext.activeSection, props.id]);

  const closeSection = useCallback(() => {
    setIsActive(false);
  }, []);

  return (
    <div id={`step-${props.id}`}>
      {!isActive && (
        <AddContentButton onClick={() => setIsActive(true)} content={formContext.getValues(props.id)}>
          Description synthétique de l’action proposée
        </AddContentButton>
      )}
      {isActive && (
        <>
          <RichTextInput
            value={formContext.getValues(props.id) || ""}
            onChange={(html) => formContext.setValue(props.id, html)}
          />
          <div className="text-end mt-6">
            <Button
              evaIcon="checkmark-circle-2"
              onClick={(e: any) => {
                e.preventDefault();
                closeSection();
                Event("DISPO_CREATE", "close section", "Section");
              }}
            >
              Fermer la section
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RichTextEdit;
