import React from "react";
import { useSelector } from "react-redux";
import { Id } from "api-types";
import { userStructureSelector } from "services/UserStructure/userStructure.selectors";
import ChoiceButton from "../../../ChoiceButton";
import styles from "./ChooseStructure.module.scss";

interface Props {
  setSelectedStructure: React.Dispatch<React.SetStateAction<Id | null>>;
  selectedStructure: Id | null;
  setOtherStructure: React.Dispatch<React.SetStateAction<boolean | null>>;
  otherStructure: boolean | null;
}

const ChooseStructure = (props: Props) => {
  const userStructure = useSelector(userStructureSelector);

  return (
    <div>
      <ChoiceButton
        text={userStructure?.nom || ""}
        type="radio"
        selected={props.selectedStructure === userStructure?._id}
        onSelect={() => {
          props.setOtherStructure(false);
          props.setSelectedStructure(userStructure?._id || null);
        }}
        image={userStructure?.picture?.secure_url}
        className={styles.structure}
      />
      <ChoiceButton
        text="Une autre structure"
        type="radio"
        selected={props.otherStructure === true}
        onSelect={() => {
          props.setOtherStructure(true);
          props.setSelectedStructure(null);
        }}
        size="lg"
        className={styles.other}
      />
    </div>
  );
};

export default ChooseStructure;
