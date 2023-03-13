import React, { useState } from "react";
import Button from "components/UI/Button";
import ChoiceButton from "../../ChoiceButton";
import BaseModal from "../BaseModal";
import PriceFree from "assets/dispositif/form-icons/price-free.svg";
import PricePay from "assets/dispositif/form-icons/price-pay.svg";
import styles from "./ModalPrice.module.scss";
import { Col, Row } from "reactstrap";

interface Props {
  show: boolean;
  toggle: () => void;
}

const help = {
  title: "À quoi sert cette information ?",
  content: "Ajoutez les éventuels frais d’inscription, les souscriptions ou les abonnements relatifs à votre action.",
};

const ModalPrice = (props: Props) => {
  const [selected, setSelected] = useState<"free" | "pay" | "none" | null>(null);

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Faut-il payer pour accéder au dispositif ?">
      <div>
        <Row className="mb-6">
          <Col>
            <ChoiceButton
              text="Gratuit"
              type="radio"
              selected={selected === "free"}
              onSelect={() => setSelected("free")}
              image={PriceFree}
            />
          </Col>
          <Col>
            <ChoiceButton
              text="Payant"
              type="radio"
              selected={selected === "pay"}
              onSelect={() => setSelected("pay")}
              image={PricePay}
            />
          </Col>
        </Row>
        <ChoiceButton
          text="Cette information n’est pas pertinente pour mon action"
          type="radio"
          selected={selected === "none"}
          onSelect={() => setSelected("none")}
          size="xs"
        />

        <div className="text-end mt-6">
          <Button icon="checkmark-circle-2" iconPlacement="end">
            Valider
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalPrice;
