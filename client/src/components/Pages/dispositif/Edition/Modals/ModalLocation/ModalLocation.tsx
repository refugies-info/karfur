import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { useFormContext } from "react-hook-form";
import { Metadatas } from "api-types";
import ChoiceButton from "../../ChoiceButton";
import BaseModal from "../BaseModal";
import { SimpleFooter } from "../components";
import { help } from "./data";
import imgAll from "assets/dispositif/form-icons/location-all.svg";
import imgDepartment from "assets/dispositif/form-icons/location-department.svg";
import imgInternet from "assets/dispositif/form-icons/location-internet.svg";
import styles from "./ModalLocation.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const ModalLocation = (props: Props) => {
  const formContext = useFormContext();
  const [selected, setSelected] = useState<"france" | "departments" | "online" | null | undefined>(undefined);

  const validate = () => {
    if (selected !== undefined) {
      const value: Metadatas["location"] = selected === "departments" ? [] : selected;
      formContext.setValue("metadatas.location", value);
    }
    props.toggle();
  };

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Où votre action est-elle accessible ?">
      <div>
        <Row className="mb-6">
          <Col>
            <ChoiceButton
              text="France entière"
              type="radio"
              selected={selected === "france"}
              onSelect={() => setSelected("france")}
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
          size="lg"
          className="mb-6"
        />

        <SimpleFooter onValidate={validate} />
      </div>
    </BaseModal>
  );
};

export default ModalLocation;
