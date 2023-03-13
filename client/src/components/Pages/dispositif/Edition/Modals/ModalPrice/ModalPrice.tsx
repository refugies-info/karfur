import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { useFormContext } from "react-hook-form";
import { Metadatas } from "api-types";
import Button from "components/UI/Button";
import ChoiceButton from "../../ChoiceButton";
import BaseModal from "../BaseModal";
import PriceFree from "assets/dispositif/form-icons/price-free.svg";
import PricePay from "assets/dispositif/form-icons/price-pay.svg";
import styles from "./ModalPrice.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const help = {
  title: "À quoi sert cette information ?",
  content: "Ajoutez les éventuels frais d’inscription, les souscriptions ou les abonnements relatifs à votre action.",
};

const ModalPrice = (props: Props) => {
  const formContext = useFormContext();
  const [selected, setSelected] = useState<"free" | "pay" | null | undefined>(undefined);

  useEffect(() => {
    if (selected !== undefined) {
      const newPrice: Metadatas["price"] =
        selected === null
          ? null
          : {
              value: selected === "free" ? 0 : 1,
            };
      formContext.setValue("metadatas.price", newPrice);
    }
  }, [selected, formContext]);

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
          selected={selected === null}
          onSelect={() => setSelected(null)}
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
