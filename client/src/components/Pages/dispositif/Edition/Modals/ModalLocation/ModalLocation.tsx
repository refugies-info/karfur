import Button from "components/UI/Button";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import ChoiceButton from "../../ChoiceButton";
import BaseModal from "../BaseModal";
import imgAll from "assets/dispositif/form-icons/location-all.svg";
import imgDepartment from "assets/dispositif/form-icons/location-department.svg";
import imgInternet from "assets/dispositif/form-icons/location-internet.svg";
import styles from "./ModalLocation.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const help = {
  title: "À quoi sert cette information ?",
  content:
    "Votre action est accessible dans quels départements ? Est-elle déployé sur toutes la France ? Ou disponible en ligne ?",
};

const ModalLocation = (props: Props) => {
  const [selected, setSelected] = useState<"all" | "departments" | "online" | null | undefined>(undefined);

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Où votre action est-elle accessible ?">
      <div>
        <Row className="mb-6">
          <Col>
            <ChoiceButton
              text="France entière"
              type="radio"
              selected={selected === "all"}
              onSelect={() => setSelected("all")}
              image={imgAll}
            />
          </Col>
          <Col>
            <ChoiceButton
              text="Départements"
              type="radio"
              selected={selected === "departments"}
              onSelect={() => setSelected("departments")}
              image={imgDepartment}
            />
          </Col>
        </Row>
        <ChoiceButton
          text="Ressource en ligne (pas de logique territoriale)"
          type="radio"
          selected={selected === "online"}
          onSelect={() => setSelected("online")}
          image={imgInternet}
          className="mb-6"
        />
        <ChoiceButton
          text="Cette information n’est pas pertinente pour mon action"
          type="radio"
          selected={selected === null}
          onSelect={() => setSelected(null)}
          size="xs"
          className="mb-6"
        />

        <div className="text-end">
          <Button icon="checkmark-circle-2" iconPlacement="end">
            Valider
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalLocation;
