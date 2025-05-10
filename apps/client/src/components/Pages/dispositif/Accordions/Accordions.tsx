"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ContentType, InfoSections } from "@refugies-info/api-types";
import { useContext } from "react";
import PageContext from "~/utils/pageContext";
import { AccordionsEdit } from "../Edition";
import SectionButtons from "../SectionButtons";
import Text from "../Text";

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
      {Object.entries(content || []).map((section) => {
        return (
          <Accordion
            key={section[0]}
            className="[&_h3_button]:text-title-grey [&_h3_button]:grid-cols-[1fr_auto_auto] [&_h3_button]:items-center [&_h3_button]:gap-1 md:[&_h3_button]:grid"
            label={
              <>
                {section[1].title}
                <SectionButtons id={`${sectionKey}.${section[0]}`} content={section[1]} />
              </>
            }
          >
            <div className="flex items-start justify-between gap-2 max-sm:flex-col-reverse [&_p:last-child]:mb-0">
              <Text className="prose max-w-full" id={`${sectionKey}.${section[0]}.text`} html>
                {section[1].text}
              </Text>
              {pageContext.mode === "view" && (
                <SectionButtons
                  className="w-fit flex-col-reverse"
                  id={`${sectionKey}.${section[0]}`}
                  content={section[1]}
                />
              )}
            </div>
          </Accordion>
        );
      })}
    </div>
  ) : (
    <AccordionsEdit sectionKey={sectionKey} contentType={contentType} />
  );
};

export default Accordions;
