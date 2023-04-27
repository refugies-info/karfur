import React, { useContext, useMemo, useState } from "react";
import { Button as RSButton, Collapse } from "reactstrap";
import styled from "styled-components";
import { ContentType, InfoSections } from "api-types";
import PageContext from "utils/pageContext";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { AccordionsEdit } from "../Edition";
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

interface Props {
  content: InfoSections | undefined;
  sectionKey: "why" | "how" | "next";
  color100: string;
  color30: string;
  contentType: ContentType;
}

/**
 * Displays a list of InfoSection in VIEW or EDIT mode
 */
const Accordions = ({ content, sectionKey, color100, color30, contentType }: Props) => {
  const pageContext = useContext(PageContext);
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (id: number) => setOpen((o) => (o === id ? null : id));
  const isOpen = (index: number) => open === index || pageContext.mode === "translate";

  const withNumber = useMemo(() => contentType === ContentType.DEMARCHE, [contentType]);

  return pageContext.mode !== "edit" ? (
    <div className={styles.container}>
      {Object.entries(content || []).map((section, i) => {
        const isItemOpen = isOpen(i);

        return (
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
            {pageContext.mode === "view" && <SectionButtons id={`${sectionKey}.${section[0]}`} content={section[1]} />}
          </div>
        );
      })}
    </div>
  ) : (
    <AccordionsEdit sectionKey={sectionKey} contentType={contentType} />
  );
};

export default Accordions;
