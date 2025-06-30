/* eslint-disable no-use-before-define */
"use client";

import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ContentType, InfoSection, InfoSections } from "@refugies-info/api-types";
import { useContext, useState } from "react";
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
  index: number;
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
    <div>
      {Object.entries(content || []).map(([sectionId, section], index) => (
        <AccordionItem
          key={sectionId}
          sectionId={sectionId}
          sectionKey={sectionKey}
          section={section}
          mode={pageContext.mode}
          index={index}
        />
      ))}
    </div>
  ) : (
    <AccordionsEdit sectionKey={sectionKey} contentType={contentType} />
  );
};

const AccordionItem = ({ sectionKey, sectionId, section, mode, index }: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Accordion
      key={sectionId}
      defaultExpanded={expanded}
      onExpandedChange={(value) => setExpanded(!value)}
      className={cn(
        styles.accordion,
        "max-md:[&_h3_button]:text-xl",
        "[&_h3_button]:text-title-grey",
        "[&_h3_button]:after:hidden",
        "[&_h3_button]:grid-cols-[1fr_auto_auto] [&_h3_button]:items-center [&_h3_button]:justify-between [&_h3_button]:gap-1 md:[&_h3_button]:grid",
        "rtl:[&_h3_button]:text-right",
      )}
      label={
        <>
          <span className="inline-flex items-center gap-2">
            {sectionKey === "how" && (
              <span className="bg-action-high-blue-france inline-flex aspect-square w-fit items-center justify-center rounded-full px-2 py-0 text-white">
                {index + 1}
              </span>
            )}
            {section.title}
          </span>
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
