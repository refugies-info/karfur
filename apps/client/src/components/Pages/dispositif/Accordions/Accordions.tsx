/* eslint-disable no-use-before-define */
"use client";

import { ContentType, type InfoSection, type InfoSections } from "@refugies-info/api-types";
import { RIAccordion } from "@refugies-info/ui";
import { useCallback, useContext, useState } from "react";
import { cn } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import PageContext from "~/utils/pageContext";
import { AccordionsEdit } from "../Edition";
import SectionButtons from "../SectionButtons";
import Text from "../Text";

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
  const pageContext = useContext(PageContext);

  const handleExpandedChange = useCallback(
    (value: boolean) => {
      setExpanded(value);
      if (value && pageContext.mode === "view") {
        Event("DISPO_VIEW", "open", "Accordion");
      }
    },
    [pageContext.mode],
  );

  return (
    <RIAccordion
      key={sectionId}
      expanded={expanded}
      onExpandedChange={handleExpandedChange}
      stepNumber={
        sectionKey === "how" && contentType === ContentType.DEMARCHE ? index + 1 : undefined
      }
      title={section.title}
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
    </RIAccordion>
  );
};

export default Accordions;
