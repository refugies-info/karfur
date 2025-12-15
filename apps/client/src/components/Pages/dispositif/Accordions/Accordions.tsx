/* eslint-disable no-use-before-define */
"use client";

import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ContentType, type InfoSection, type InfoSections } from "@refugies-info/api-types";
import { useContext, useState } from "react";
import { cn } from "~/lib/classname";
import PageContext from "~/utils/pageContext";
import { AccordionsEdit } from "../Edition";
import SectionButtons from "../SectionButtons";
import Text from "../Text";
import styles from "./Accordions.module.scss";

interface AccordionItemProps {
  contentType: ContentType;
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
          contentType={contentType}
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

const AccordionItem = ({
  contentType,
  sectionKey,
  sectionId,
  section,
  mode,
  index,
}: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Accordion
      key={sectionId}
      defaultExpanded={expanded}
      onExpandedChange={(value) => setExpanded(!value)}
      className={cn(
        styles.accordion,
        "max-md:[&_h3_button]:text-lg",
        "[&_h3_button]:text-title-grey",
        "[&_h3_button]:after:hidden",
        "[&_h3_button]:grid-cols-[1fr_auto_auto] [&_h3_button]:items-start [&_h3_button]:justify-between [&_h3_button]:gap-1 md:[&_h3_button]:grid",
        "rtl:[&_h3_button]:text-right",
      )}
      label={
        <>
          <span className="inline-flex items-start gap-2 leading-[1.75rem]">
            {sectionKey === "how" && contentType === ContentType.DEMARCHE && (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full pt-1">
                <span className="bg-action-high-blue-france flex h-6 w-6 items-center justify-center rounded-full p-[0.41669rem] text-white md:p-0.5">
                  {index + 1}
                </span>
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
          <SectionButtons
            className="w-fit flex-col-reverse max-md:ms-4"
            id={`${sectionKey}.${sectionId}`}
            content={section}
          />
        )}
      </div>
    </Accordion>
  );
};

export default Accordions;
