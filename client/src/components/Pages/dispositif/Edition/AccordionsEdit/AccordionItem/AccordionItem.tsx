import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import PageContext from "utils/pageContext";
import Button from "components/UI/Button";
import Text from "components/Pages/dispositif/Text";
import AddContentButton from "../../AddContentButton";
import styles from "./AccordionItem.module.scss";

const RichTextInput = dynamic(() => import("components/UI/RichTextInput"), { ssr: false });

interface Props {
  id: string;
  onDelete?: (() => void) | false;
  label?: string;
}

/**
 * Form component of an InfoSection. Responsible of getting and setting its own value
 */
const AccordionItem = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const { unregister, register, getValues, setValue } = useFormContext();

  const getContent = () => {
    const title = getValues(`${props.id}.title`);
    const text = getValues(`${props.id}.text`);
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

  // when item unmounted, delete it from form values
  useEffect(() => {
    return () => unregister(props.id);
  }, [unregister, props.id]);

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

  const toggleIsActive = useCallback(() => setIsActive(true), []);

  return (
    <div>
      {!isActive && (
        <AddContentButton
          onClick={toggleIsActive}
          size="lg"
          className="mb-6"
          content={getContent()}
          onDelete={props.onDelete}
          hasError={!!getContent() && (!getValues(`${props.id}.title`) || !getValues(`${props.id}.text`))}
        >
          {props.label || "Argument"}
        </AddContentButton>
      )}
      {isActive && (
        <>
          <div className={styles.item}>
            <input
              type="text"
              placeholder="Titre de l'argument"
              {...register(`${props.id}.title`)}
              className={styles.input}
            />
            <RichTextInput value={getValues(`${props.id}.text`)} id={`${props.id}.text`} />
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

export default AccordionItem;