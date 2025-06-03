/* eslint-disable no-use-before-define */
"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ContentType, InfoSection, InfoSections } from "@refugies-info/api-types";
import { useContext, useMemo, useState } from "react";
import { cn } from "~/lib/classname";
import PageContext from "~/utils/pageContext";
import { AccordionsEdit } from "../Edition";
import SectionButtons from "../SectionButtons";
import Text from "../Text";
import styles from "./Accordions.module.scss";

interface AccordionItemProps {
  sectionKey: string;
  sectionId: string;
  section: InfoSection;
  mode: string;
}

interface Props {
  content: InfoSections | undefined;
  sectionKey: "why" | "how" | "next";
  contentType: ContentType;
}

/**
 * Displays a list of InfoSection in VIEW or EDIT mode
 */
const Accordions = ({ content, sectionKey, contentType }: Props) => {
  const pageContext = useContext(PageContext);

  return pageContext.mode !== "edit" ? (
    <div className={fr.cx("fr-accordions-group")}>
      {Object.entries(content || []).map(([sectionId, section]) => (
        <AccordionItem
          key={sectionId}
          sectionId={sectionId}
          sectionKey={sectionKey}
          section={section}
          mode={pageContext.mode}
        />
      ))}
    </div>
  ) : (
    <AccordionsEdit sectionKey={sectionKey} contentType={contentType} />
  );
};

const AccordionItem = ({ sectionKey, sectionId, section, mode }: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const sectionTitle = useMemo(() => {
    const titleMatch = section.title.match(/^(\d+)\s*-?\s*(.*)$/);
    return titleMatch ? (
      <span className="flex items-center gap-2">
        <span className="bg-action-high-blue-france rounded-full px-2 py-0 text-white">{titleMatch[1]}</span>
        {titleMatch[2]}
      </span>
    ) : (
      section.title
    );
  }, [section.title]);

  return (
    <Accordion
      key={sectionId}
      defaultExpanded={expanded}
      onExpandedChange={(value) => setExpanded(!value)}
      className={cn(
        styles.accordion,
        "[&_h3_button]:text-title-grey",
        "[&_h3_button]:after:hidden",
        "[&_h3_button]:grid-cols-[1fr_auto_auto] [&_h3_button]:items-center [&_h3_button]:justify-between [&_h3_button]:gap-1 md:[&_h3_button]:grid",
      )}
      label={
        <>
          <span>{sectionTitle}</span>{" "}
          <span className="flex items-center">
            <i className="ri-add-fill scale-75" />
            <i className="ri-subtract-fill scale-75" />
          </span>
        </>
      }
    >
      <div className="flex items-start justify-between gap-2 max-sm:flex-col-reverse [&_p:last-child]:mb-0">
        <Text className="prose max-w-full max-sm:px-4" id={`${sectionKey}.${sectionId}.text`} html>
          {section.text}
        </Text>
        {mode === "view" && (
          <SectionButtons className="w-fit flex-col-reverse" id={`${sectionKey}.${sectionId}`} content={section} />
        )}
      </div>
    </Accordion>
  );
};

export default Accordions;
