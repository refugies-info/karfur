import React, { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { ContentType, CreateDispositifRequest, InfoSections } from "api-types";
import Button from "components/UI/Button";
import { getMaxAccordions } from "lib/dispositifForm";
import AccordionItem from "./AccordionItem";
import styles from "./AccordionsEdit.module.scss";

interface Props {
  sectionKey: "why" | "how" | "next";
  contentType: ContentType;
}

/**
 * Accordions in EDIT mode. Gets its value from FormContext
 */
const AccordionsEdit = ({ sectionKey, contentType }: Props) => {
  const isLastSection = useMemo(
    () =>
      (contentType === ContentType.DISPOSITIF && sectionKey === "how") ||
      (contentType === ContentType.DEMARCHE && sectionKey === "next"),
    [contentType, sectionKey],
  );
  const content: InfoSections = useWatch({ name: sectionKey });
  const { setValue } = useFormContext<CreateDispositifRequest>();

  const addElement = () => {
    const key = uuidv4();
    const newContent: InfoSections = {
      ...content,
      [key]: { title: "", text: "" },
    };
    setValue(sectionKey, newContent);
  };
  const deleteElement = (key: string) => {
    const newContent: InfoSections = { ...content };
    delete newContent[key];
    setValue(sectionKey, newContent);
  };

  return (
    <div id={`step-${sectionKey}`}>
      {Object.entries(content).map((section, i) => (
        <AccordionItem
          key={section[0]}
          id={`${sectionKey}.${section[0]}`}
          onDelete={
            Object.keys(content).length > getMaxAccordions(contentType, sectionKey)
              ? () => deleteElement(section[0])
              : false
          }
          label={isLastSection ? "Contact et modalités d’inscription" : undefined}
        />
      ))}

      <Button icon="plus-circle-outline" secondary onClick={addElement}>
        {isLastSection ? "Ajouter une option" : "Ajouter un argument"}
      </Button>
    </div>
  );
};

export default AccordionsEdit;
