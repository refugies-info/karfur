import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { conditionType, CreateDispositifRequest } from "api-types";
import { entries } from "lib/typedObjectEntries";
import ChoiceButton from "../../ChoiceButton";
import BaseModal from "../BaseModal";
import { SimpleFooter } from "../components";
import { dropdownOptions, help } from "./data";
import styles from "./ModalConditions.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const ModalConditions = (props: Props) => {
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();
  const [selected, setSelected] = useState<conditionType[] | null>(getValues("metadatas.conditions") || []);
  const toggleItem = (item: conditionType) =>
    setSelected((items) => (items?.includes(item) ? items.filter((i) => i !== item) : [...(items || []), item]));

  const validate = () => {
    if (selected !== undefined) {
      setValue("metadatas.conditions", selected);
    }
    props.toggle();
  };

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Faut-il remplir des conditions ?">
      <div>
        <div>
          {entries<Record<conditionType, { text: string; image: any }>>(dropdownOptions).map(([key, data]) => (
            <ChoiceButton
              key={key}
              text={data.text}
              type="checkbox"
              selected={!!selected?.includes(key)}
              onSelect={() => toggleItem(key)}
              image={data.image}
              className="mb-2"
              size="sm"
            />
          ))}

          <ChoiceButton
            text="Cette information n’est pas pertinente pour mon action"
            type="radio"
            selected={selected === null}
            onSelect={() => setSelected(null)}
            size="lg"
            className="my-6"
          />
        </div>

        <SimpleFooter onValidate={validate} />
      </div>
    </BaseModal>
  );
};

export default ModalConditions;
