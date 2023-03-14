import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { conditionType, Metadatas } from "api-types";
import Button from "components/UI/Button";
import ChoiceButton from "../../ChoiceButton";
import BaseModal from "../BaseModal";
import imgCb from "assets/dispositif/form-icons/conditions-cb.svg";
import imgDriver from "assets/dispositif/form-icons/conditions-driver.svg";
import imgOfpra from "assets/dispositif/form-icons/conditions-ofpra.svg";
import imgPoleEmploi from "assets/dispositif/form-icons/conditions-pole-emploi.svg";
import imgTse from "assets/dispositif/form-icons/conditions-tse.svg";
import imgOfii from "assets/dispositif/form-icons/conditions-ofii.svg";
import styles from "./ModalConditions.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const help = {
  title: "À quoi sert cette information ?",
  content: "Ajoutez des conditions seulement si elles sont vraiment des critères excluant pour accéder à votre action.",
};

const ModalConditions = (props: Props) => {
  const formContext = useFormContext();
  const [selected, setSelected] = useState<conditionType[] | null>([]);
  const toggleItem = (item: conditionType) =>
    setSelected((items) => (items?.includes(item) ? items.filter((i) => i !== item) : [...(items || []), item]));

  const validate = () => {
    if (selected !== undefined) {
      const value: Metadatas["conditions"] = selected;
      formContext.setValue("metadatas.conditions", value);
    }
    props.toggle();
  };

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Faut-il remplir des conditions ?">
      <div>
        <div>
          <ChoiceButton
            text="Avoir l’acte de naissance donné par l’OFPRA"
            type="checkbox"
            selected={!!selected?.includes("acte naissance")}
            onSelect={() => toggleItem("acte naissance")}
            image={imgOfpra}
            className="mb-2"
            size="sm"
          />
          <ChoiceButton
            text="Avoir son titre de séjour ou son récépissé"
            type="checkbox"
            selected={!!selected?.includes("titre sejour")}
            onSelect={() => toggleItem("titre sejour")}
            image={imgTse}
            className="mb-2"
            size="sm"
          />
          <ChoiceButton
            text="Avoir signé le CIR et terminé les cours OFII"
            type="checkbox"
            selected={!!selected?.includes("cir")}
            onSelect={() => toggleItem("cir")}
            image={imgOfii}
            className="mb-2"
            size="sm"
          />
          <ChoiceButton
            text="Avoir un compte bancaire"
            type="checkbox"
            selected={!!selected?.includes("bank account")}
            onSelect={() => toggleItem("bank account")}
            image={imgCb}
            className="mb-2"
            size="sm"
          />
          <ChoiceButton
            text="Être inscrit à Pôle Emploi"
            type="checkbox"
            selected={!!selected?.includes("pole emploi")}
            onSelect={() => toggleItem("pole emploi")}
            image={imgPoleEmploi}
            className="mb-2"
            size="sm"
          />
          <ChoiceButton
            text="Avoir son permis B"
            type="checkbox"
            selected={!!selected?.includes("driver license")}
            onSelect={() => toggleItem("driver license")}
            image={imgDriver}
            className="mb-2"
            size="sm"
          />

          <ChoiceButton
            text="Cette information n’est pas pertinente pour mon action"
            type="radio"
            selected={selected === null}
            onSelect={() => setSelected(null)}
            size="lg"
            className="my-6"
          />
        </div>

        <div className="text-end">
          <Button icon="checkmark-circle-2" iconPlacement="end" onClick={validate}>
            Valider
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalConditions;
