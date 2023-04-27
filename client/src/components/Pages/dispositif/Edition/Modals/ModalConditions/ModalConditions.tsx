import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { conditionType, CreateDispositifRequest } from "api-types";
import { entries } from "lib/typedObjectEntries";
import { BaseModal } from "components/Pages/dispositif";
import ChoiceButton from "../../ChoiceButton";
import { SimpleFooter } from "../components";
import { dropdownOptions, help } from "./data";
import NoIcon from "assets/dispositif/no-icon.svg";
import styles from "./ModalConditions.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const ModalConditions = (props: Props) => {
  const { t } = useTranslation();
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();
  const [selected, setSelected] = useState<conditionType[] | null>( // if undefined, nothing selected. Else, data or null
    getValues("metadatas.conditions") === undefined ? [] : getValues("metadatas.conditions") || null,
  );
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
          {entries<Record<conditionType, any>>(dropdownOptions).map(([key, image]) => (
            <ChoiceButton
              key={key}
              text={t(`Infocards.${key}`)}
              type="checkbox"
              selected={!!selected?.includes(key)}
              onSelect={() => toggleItem(key)}
              image={image}
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
            image={NoIcon}
          />
        </div>

        <SimpleFooter onValidate={validate} disabled={selected !== null && selected.length === 0} />
      </div>
    </BaseModal>
  );
};

export default ModalConditions;
