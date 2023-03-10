import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import AddContentButton from "../AddContentButton";
import styles from "./TitleEdit.module.scss";

interface Props {
  id: string;
  value: string | undefined;
}

const TitleEdit = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const formContext = useFormContext();

  return (
    <div>
      {!isActive && (
        <AddContentButton onClick={() => setIsActive(true)} size="xl">
          Titre
        </AddContentButton>
      )}
      {isActive && <input type="text" {...formContext.register(props.id)} />}
    </div>
  );
};

export default TitleEdit;
