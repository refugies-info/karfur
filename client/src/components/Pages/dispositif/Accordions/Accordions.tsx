import { InfoSections } from "api-types";
import React from "react";

interface Props {
  content: InfoSections | undefined;
}

const Accordions = ({ content }: Props) => {
  if (!content) return <></>;
  return (
    <section>
      {Object.values(content).map((section: any, i) => (
        <div key={i}>
          <h2>{section.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: section.text }}></div>
        </div>
      ))}
    </section>
  );
};

export default Accordions;
