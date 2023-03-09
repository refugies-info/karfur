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
  border: string;
  background: string;
}

const ColoredButton = styled(Button)<ColoredButtonProps>`
  :hover,
  &.${styles.open} {
    background: ${(props) => props.background} !important;
    border-color: ${(props) => props.border};
  }
`;

interface Props {
  content: InfoSections | undefined;
  sectionKey: string;
  color100: string;
  color30: string;
  withNumber?: boolean;
}

const Accordions = ({ content, sectionKey, color100, color30, withNumber }: Props) => {
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
                  background={color30}
                  border={color100}
                >
                  <h2 className={styles.title} style={{ color: color100 }}>
                    {withNumber && (
                      <span className={styles.badge} style={{ backgroundColor: color100 }}>
                        {i + 1}
                      </span>
                    )}
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
