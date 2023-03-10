import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import { InfoSection } from "api-types";
import Button from "components/UI/Button";
import AddContentButton from "../AddContentButton";
import Text from "../../Text";
import styles from "./AccordionItemEdit.module.scss";

const RichTextInput = dynamic(() => import("components/UI/RichTextInput"), { ssr: false });

interface Props {
  id: string;
  section: [string, InfoSection];
}

const AccordionItemEdit = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const formContext = useFormContext();

  const getContent = () => {
    const title = formContext.getValues(`${props.id}.title`);
    const text = formContext.getValues(`${props.id}.text`);
    if (!title && !text) return;

    return (
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.text}>
          <Text id={`${props.id}.text`} html>
            {text}
          </Text>
        </div>
      </div>
    );
  };

  return (
    <div>
      {!isActive && (
        <AddContentButton onClick={() => setIsActive(true)} size="lg" className="mb-6" content={getContent()}>
          Argument
        </AddContentButton>
      )}
      {isActive && (
        <>
          <div className={styles.item}>
            <input
              type="text"
              placeholder="Titre de l'argument"
              {...formContext.register(`${props.id}.title`)}
              className={styles.input}
            />
            <RichTextInput value={props.section[1].text || ""} id={`${props.id}.text`} />
          </div>
          <div className="text-end mb-6">
            <Button icon="checkmark-circle-2" onClick={() => setIsActive(false)}>
              Fermer la section
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AccordionItemEdit;
