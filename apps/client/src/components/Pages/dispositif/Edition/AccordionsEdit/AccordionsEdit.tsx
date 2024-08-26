import Button from "@/components/UI/Button";
import { getMaxAccordions } from "@/lib/dispositifForm";
import { ContentType, CreateDispositifRequest, InfoSections } from "@refugies-info/api-types";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import AccordionItem from "./AccordionItem";
import styles from "./AccordionsEdit.module.scss";
import { getTexts } from "./functions";

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

  const addElement = (e: any) => {
    e.preventDefault();
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

  const maxAccordions = useMemo(() => getMaxAccordions(contentType, sectionKey), [contentType, sectionKey]);

  return (
    <div id={`step-${sectionKey}`}>
      {maxAccordions > 1 && <p className={styles.subtitle}>Développez minimum {maxAccordions} arguments.</p>}
      {Object.entries(content || {}).map((section, i) => {
        const texts = getTexts(contentType, isLastSection, i);
        return (
          <AccordionItem
            key={section[0]}
            index={i}
            id={`${sectionKey}.${section[0]}`}
            onDelete={Object.keys(content).length > maxAccordions ? () => deleteElement(section[0]) : false}
            label={texts.buttonText}
            placeholderTitle={texts.placeholderTitle}
            placeholderText={texts.placeholderText}
          />
        );
      })}

      <Button evaIcon="plus-circle-outline" priority="secondary" onClick={addElement}>
        {getTexts(contentType, isLastSection, 0).addButtonText}
      </Button>
    </div>
  );
};

export default AccordionsEdit;
