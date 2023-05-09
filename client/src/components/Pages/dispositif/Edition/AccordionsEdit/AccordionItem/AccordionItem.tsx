import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { useContentType } from "hooks/dispositif";
import PageContext from "utils/pageContext";
import { cls } from "lib/classname";
import { themeSelector } from "services/Themes/themes.selectors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Button from "components/UI/Button";
import Text from "components/Pages/dispositif/Text";
import AccordionBadge from "components/Pages/dispositif/AccordionBadge";
import AddContentButton from "../../AddContentButton";
import styles from "./AccordionItem.module.scss";

const RichTextInput = dynamic(() => import("components/UI/RichTextInput"), { ssr: false });

interface Props {
  id: string;
  index: number;
  onDelete?: (() => void) | false;
  label: string;
  placeholderTitle: string;
  placeholderText?: string;
}

/**
 * Form component of an InfoSection. Responsible of getting and setting its own value
 */
const AccordionItem = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const { unregister, register, getValues, setValue } = useFormContext();

  const currentTheme = useSelector(themeSelector(getValues("theme")));
  const color = currentTheme?.colors.color100 || "#000";
  const contentType = useContentType();

  const getContent = () => {
    const title = getValues(`${props.id}.title`);
    const text = getValues(`${props.id}.text`);
    if (!title && !text) return;

    return (
      <div className={styles.content}>
        <div className={styles.title}>
          <AccordionBadge index={props.index + 1} sectionKey={props.id} contentType={contentType} color100={color} />
          {title}
        </div>
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
          <span className={styles.button_inner}>
            <span className="d-flex align-items-center">
              <AccordionBadge
                index={props.index + 1}
                sectionKey={props.id}
                contentType={contentType}
                color100={color}
              />
              {props.label}
            </span>
            {props.onDelete && (
              <span className={cls(styles.remove, "me-4")}>
                <EVAIcon
                  name="trash-2-outline"
                  size={32}
                  fill={styles.lightTextMentionGrey}
                  onClick={(e: any) => {
                    e.preventDefault();
                    props.onDelete ? props.onDelete() : null;
                  }}
                />
              </span>
            )}
          </span>
        </AddContentButton>
      )}
      {isActive && (
        <>
          <div className={styles.item}>
            <div className={styles.title}>
              <AccordionBadge
                index={props.index + 1}
                sectionKey={props.id}
                contentType={contentType}
                color100={color}
              />
              <input
                type="text"
                placeholder={props.placeholderTitle}
                {...register(`${props.id}.title`)}
                className={styles.input}
              />
            </div>
            <RichTextInput
              value={getValues(`${props.id}.text`)}
              onChange={(html) => setValue(`${props.id}.text`, html)}
              placeholder={props.placeholderText}
            />
          </div>
          <div className="text-end mb-6">
            <Button
              evaIcon="checkmark-circle-2"
              onClick={(e: any) => {
                e.preventDefault();
                setIsActive(false);
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

export default AccordionItem;
