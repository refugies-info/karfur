import React, { useState } from "react";
import dynamic from "next/dynamic";
import AddContentButton from "../AddContentButton";
import styles from "./RichText.module.scss";

const RichTextInput = dynamic(() => import("components/UI/RichTextInput"), { ssr: false });

interface Props {
  id: string;
  value: string | undefined;
}

const RichText = (props: Props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      {!isActive && <AddContentButton onClick={() => setIsActive(true)}>texte</AddContentButton>}
      {isActive && <RichTextInput value={props.value || ""} id={props.id} />}
    </div>
  );
};

export default RichText;
