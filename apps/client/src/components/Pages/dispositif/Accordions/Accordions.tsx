import { ContentType, InfoSections } from "@refugies-info/api-types";
import { useContext, useState } from "react";
import { Collapse, Button as RSButton } from "reactstrap";
import styled from "styled-components";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { cls } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import PageContext from "~/utils/pageContext";
import AccordionBadge from "../AccordionBadge";
import { AccordionsEdit } from "../Edition";
import SectionButtons from "../SectionButtons";
import Text from "../Text";
import styles from "./Accordions.module.scss";

interface ColoredButtonProps {
  $border: string;
  $background: string;
}

const ColoredButton = styled(RSButton)<ColoredButtonProps>`
  &:hover,
  &.${styles.open} {
    background: ${(props) => props.$background} !important;
    border-color: ${(props) => props.$border};
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
  const [open, setOpen] = useState<number[]>([]);

  const toggle = (id: number) => {
    setOpen((o) => (o.includes(id) ? o.filter((item) => item !== id) : [...o, id]));
    if (pageContext.mode === "view") {
      Event("DISPO_VIEW", "open", "Accordion");
    }
  };
  const isOpen = (index: number) => open.includes(index) || pageContext.mode === "translate";

  return pageContext.mode !== "edit" ? (
    <div className={styles.container}>
      {Object.entries(content || []).map((section, i) => {
        const isItemOpen = isOpen(i);

        return (
          <div key={section[0]} className={styles.accordion}>
            <ColoredButton
              className={cls(styles.btn, isItemOpen && styles.open)}
              onClick={() => toggle(i)}
              $background={color30}
              $border={color100}
            >
              <h2 className={styles.title} style={{ color: color100 }}>
                <AccordionBadge index={i + 1} sectionKey={sectionKey} contentType={contentType} color100={color100} />
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
