import React, { useContext, useEffect, useState } from "react";
import { Button as RSButton, Collapse } from "reactstrap";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { InfoSections } from "api-types";
import PageContext from "utils/pageContext";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Button from "components/UI/Button";
import { AccordionItemEdit } from "../Edition";
import SectionButtons from "../SectionButtons";
import Text from "../Text";
import styles from "./Accordions.module.scss";

interface ColoredButtonProps {
  border: string;
  background: string;
}

const ColoredButton = styled(RSButton)<ColoredButtonProps>`
  :hover,
  &.${styles.open} {
    background: ${(props) => props.background} !important;
    border-color: ${(props) => props.border};
  }
`;

const MIN_ACCORDIONS = 3;

interface Props {
  content: InfoSections | undefined;
  sectionKey: string;
  color100: string;
  color30: string;
  withNumber?: boolean;
}

/**
 * Displays a list of InfoSection in VIEW or EDIT mode
 */
const Accordions = ({ content, sectionKey, color100, color30, withNumber }: Props) => {
  const pageContext = useContext(PageContext);
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (id: number) => setOpen((o) => (o === id ? null : id));
  const isOpen = (index: number) => open === index || pageContext.mode === "edit";

  const [currentContent, setCurrentContent] = useState<InfoSections>(content || {});
  useEffect(() => {
    if (pageContext.mode === "edit" && Object.keys(currentContent).length === 0) {
      // generate content
      const newContent: InfoSections = {};
      for (let i = 0; i < MIN_ACCORDIONS; i++) {
        const key = uuidv4();
        newContent[key] = { title: "", text: "" };
      }
      setCurrentContent(newContent);
    }
  }, [pageContext.mode, currentContent]);

  const addElement = () => {
    const key = uuidv4();
    const newContent: InfoSections = {
      ...currentContent,
      [key]: { title: "", text: "" },
    };
    setCurrentContent(newContent);
  };
  const deleteElement = (key: string) => {
    const newContent: InfoSections = { ...currentContent };
    delete newContent[key];
    setCurrentContent(newContent);
  };

  return (
    <div className={styles.container}>
      {Object.entries(currentContent).map((section, i) => {
        const isItemOpen = isOpen(i);

        return pageContext.mode === "view" ? (
          <div key={section[0]} className={styles.accordion}>
            <ColoredButton
              className={cls(styles.btn, isItemOpen && styles.open)}
              onClick={() => toggle(i)}
              background={color30}
              border={color100}
            >
              <h2 className={styles.title} style={{ color: color100 }}>
                {withNumber && (
                  <span className={styles.badge} style={{ backgroundColor: color100 }}>
                    {i + 1}
                  </span>
                )}
                <Text id={`${sectionKey}.${section[0]}.title`}>{section[1].title}</Text>
              </h2>
              <EVAIcon name="arrow-ios-downward-outline" fill={color100} size={32} className={styles.icon} />
            </ColoredButton>
            <Collapse isOpen={isItemOpen}>
              <div className={styles.content}>
                <Text id={`${sectionKey}.${section[0]}.text`} html>
                  {section[1].text}
                </Text>
              </div>
            </Collapse>
            <SectionButtons id={`${sectionKey}.${section[0]}`} content={section[1]} />
          </div>
        ) : (
          <AccordionItemEdit
            key={section[0]}
            id={`${sectionKey}.${section[0]}`}
            onDelete={Object.keys(currentContent).length > MIN_ACCORDIONS ? () => deleteElement(section[0]) : false}
          />
        );
      })}

      {pageContext.mode === "edit" && (
        <Button icon="plus-circle-outline" secondary onClick={addElement}>
          Ajouter un argument
        </Button>
      )}
    </div>
  );
};

export default Accordions;
