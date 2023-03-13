import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import Button from "components/UI/Button";
import AddContentButton from "../AddContentButton";
import styles from "./RichText.module.scss";

const RichTextInput = dynamic(() => import("components/UI/RichTextInput"), { ssr: false });

interface Props {
  id: string;
}

const RichText = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const formContext = useFormContext();

  return (
    <div>
      {!isActive && (
        <AddContentButton onClick={() => setIsActive(true)} content={formContext.getValues(props.id)}>
          Description synthétique de l’action proposée
        </AddContentButton>
      )}
      {isActive && (
        <>
          <RichTextInput value={formContext.getValues(props.id) || ""} id={props.id} />
          <div className="text-end mt-6">
            <Button icon="checkmark-circle-2" onClick={() => setIsActive(false)}>
              Fermer la section
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RichText;
