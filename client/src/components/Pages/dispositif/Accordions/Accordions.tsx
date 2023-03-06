import { InfoSections } from "api-types";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import React, { useContext, useState } from "react";
import { Button, Collapse } from "reactstrap";
import styled from "styled-components";
import PageContext from "utils/pageContext";
import RichText from "../RichText";
import SectionButtons from "../SectionButtons";
import TextInput from "../TextInput";
import styles from "./Accordions.module.scss";

interface ColoredButtonProps {
  borderColor: string;
  backgroundColor: string;
}

const ColoredButton = styled(Button)<ColoredButtonProps>`
  :hover,
  &.${styles.open} {
    background: ${(props) => props.backgroundColor} !important;
    border-color: ${(props) => props.borderColor};
  }
`;

interface Props {
  content: InfoSections | undefined;
  sectionKey: string;
  color100: string;
  color30: string;
}

const Accordions = ({ content, sectionKey, color100, color30 }: Props) => {
  const pageContext = useContext(PageContext);
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (id: number) => setOpen((o) => (o === id ? null : id));
  const isOpen = (index: number) => open === index || pageContext.mode === "edit";

  return (
    <div className={styles.container}>
      {content ? (
        <>
          {Object.entries(content).map((section, i) => {
            const isItemOpen = isOpen(i);

            return (
              <div key={section[0]} className={styles.accordion}>
                <ColoredButton
                  className={cls(styles.btn, isItemOpen && styles.open)}
                  onClick={() => toggle(i)}
                  backgroundColor={color30}
                  borderColor={color100}
                >
                  <h2 className={styles.title} style={{ color: color100 }}>
                    <TextInput id={`${sectionKey}.${section[0]}.title`} value={section[1].title} />
                  </h2>
                  <EVAIcon name="arrow-ios-downward-outline" fill={color100} size={32} className={styles.icon} />
                </ColoredButton>
                <Collapse isOpen={isItemOpen}>
                  <div className={styles.content}>
                    <RichText id={`${sectionKey}.${section[0]}.text`} value={section[1].text} />
                  </div>
                </Collapse>
                <SectionButtons id={`${sectionKey}.${section[0]}`} />
              </div>
            );
          })}
        </>
      ) : (
        <>
          <div>
            <h2 className={styles.title}>
              <TextInput id={`${sectionKey}.a.title`} value={""} />
            </h2>
            <RichText id={`${sectionKey}.a.text`} value={""} />
          </div>
        </>
      )}
    </div>
  );
};

export default Accordions;
