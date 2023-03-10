import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import { InfoSection } from "api-types";
import AddContentButton from "../AddContentButton";
import styles from "./AccordionItemEdit.module.scss";

const RichTextInput = dynamic(() => import("components/UI/RichTextInput"), { ssr: false });

interface Props {
  id: string;
  section: [string, InfoSection];
}

const AccordionItemEdit = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const formContext = useFormContext();

  return (
    <div>
      {!isActive && (
        <AddContentButton onClick={() => setIsActive(true)} size="lg" className="mb-6">
          Argument
        </AddContentButton>
      )}
      {isActive && (
        <div className="mb-6">
          <input type="text" {...formContext.register(`${props.id}.text`)} value={props.section[1].title} />
          <RichTextInput value={props.section[1].text || ""} id={`${props.id}.title`} />
        </div>
      )}
    </div>
  );
};

export default AccordionItemEdit;
