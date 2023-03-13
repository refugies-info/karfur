import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
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

type Condition = "cb" | "driver" | "ofpra" | "pole-emploi" | "tse" | "ofii";

const ModalConditions = (props: Props) => {
  const formContext = useFormContext();
  const [selected, setSelected] = useState<Condition[] | null>([]);
  const toggleItem = (item: Condition) =>
    setSelected((items) => (items?.includes(item) ? items.filter((i) => i !== item) : [...(items || []), item]));

  const validate = () => {
    if (selected !== undefined) {
      // TODO: update conditions metadatas schema and set value
      formContext.setValue("metadatas.conditions", {});
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
            selected={!!selected?.includes("ofpra")}
            onSelect={() => toggleItem("ofpra")}
            image={imgOfpra}
            className="mb-2"
            size="sm"
          />
          <ChoiceButton
            text="Avoir son titre de séjour ou son récépissé"
            type="checkbox"
            selected={!!selected?.includes("tse")}
            onSelect={() => toggleItem("tse")}
            image={imgTse}
            className="mb-2"
            size="sm"
          />
          <ChoiceButton
            text="Avoir signé le CIR et terminé les cours OFII"
            type="checkbox"
            selected={!!selected?.includes("ofii")}
            onSelect={() => toggleItem("ofii")}
            image={imgOfii}
            className="mb-2"
            size="sm"
          />
          <ChoiceButton
            text="Avoir un compte bancaire"
            type="checkbox"
            selected={!!selected?.includes("cb")}
            onSelect={() => toggleItem("cb")}
            image={imgCb}
            className="mb-2"
            size="sm"
          />
          <ChoiceButton
            text="Être inscrit à Pôle Emploi"
            type="checkbox"
            selected={!!selected?.includes("pole-emploi")}
            onSelect={() => toggleItem("pole-emploi")}
            image={imgPoleEmploi}
            className="mb-2"
            size="sm"
          />
          <ChoiceButton
            text="Avoir son permis B"
            type="checkbox"
            selected={!!selected?.includes("driver")}
            onSelect={() => toggleItem("driver")}
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
