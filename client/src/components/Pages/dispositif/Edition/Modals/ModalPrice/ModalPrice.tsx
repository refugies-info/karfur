import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { useFormContext } from "react-hook-form";
import { Metadatas, priceDetails } from "api-types";
import Button from "components/UI/Button";
import ChoiceButton from "../../ChoiceButton";
import DropdownModals from "../../DropdownModals";
import InlineForm from "../components/InlineForm";
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

const dropdownOptions: Record<priceDetails, string> = {
  once: "Une seule fois",
  eachTime: "À chaque fois",
  hour: "Par heure",
  day: "Par jour",
  week: "Par semaine",
  month: "Par mois",
  trimester: "Par trimestre",
  semester: "Par semestre",
  year: "Par an",
};

const ModalPrice = (props: Props) => {
  const formContext = useFormContext();
  const [selected, setSelected] = useState<"free" | "pay" | null | undefined>(undefined);
  const [selectedPay, setSelectedPay] = useState<"once" | "between" | "free" | undefined>(undefined);
  const [selectedRecurent, setSelectedRecurent] = useState<priceDetails>("once");
  const [priceStart, setPriceStart] = useState<number | undefined>(undefined);
  const [priceEnd, setPriceEnd] = useState<number | undefined>(undefined);

  const validate = () => {
    if (selected !== undefined) {
      let newPrice: Metadatas["price"] | null = null;
      if (selected === "free") {
        newPrice = { values: [0] };
      } else if (selected === "pay") {
        if (selectedPay === "once") {
          if (!priceStart) return;
          newPrice = {
            values: [priceStart],
            details: selectedRecurent as priceDetails,
          };
        } else if (selectedPay === "between") {
          if (!priceStart || !priceEnd) return;
          newPrice = {
            values: [priceStart, priceEnd],
            details: selectedRecurent as priceDetails,
          };
        } else if (selectedPay === "free") {
          newPrice = { values: [] };
        }
      }
      formContext.setValue("metadatas.price", newPrice);
    }
    props.toggle();
  };

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

        {selected === "pay" && (
          <div className={styles.form}>
            <p className={styles.title}>Combien ça coûte ?</p>
            <Row>
              <Col>
                <ChoiceButton
                  text="Montant fixe"
                  type="radio"
                  selected={selectedPay === "once"}
                  onSelect={() => setSelectedPay("once")}
                />
              </Col>
              <Col>
                <ChoiceButton
                  text="Fourchette"
                  type="radio"
                  selected={selectedPay === "between"}
                  onSelect={() => setSelectedPay("between")}
                />
              </Col>
              <Col>
                <ChoiceButton
                  text="Montant libre"
                  type="radio"
                  selected={selectedPay === "free"}
                  onSelect={() => setSelectedPay("free")}
                />
              </Col>
            </Row>
            {selectedPay === "once" && (
              <InlineForm>
                <span className={styles.price}>
                  <input
                    type="number"
                    placeholder={"0"}
                    value={priceStart}
                    onChange={(e: any) => setPriceStart(e.target.value)}
                  />
                </span>
                <DropdownModals<priceDetails>
                  options={dropdownOptions}
                  selected={selectedRecurent}
                  setSelected={(key: priceDetails) => setSelectedRecurent(key)}
                />
              </InlineForm>
            )}

            {selectedPay === "between" && (
              <InlineForm>
                <p>entre</p>
                <span className={styles.price}>
                  <input
                    type="number"
                    placeholder={"0"}
                    value={priceStart}
                    onChange={(e: any) => setPriceStart(e.target.value)}
                  />
                </span>
                <p>et</p>
                <span className={styles.price}>
                  <input
                    type="number"
                    placeholder={"0"}
                    value={priceEnd}
                    onChange={(e: any) => setPriceEnd(e.target.value)}
                  />
                </span>
                <DropdownModals<priceDetails>
                  options={dropdownOptions}
                  selected={selectedRecurent}
                  setSelected={(key: priceDetails) => setSelectedRecurent(key)}
                />
              </InlineForm>
            )}
          </div>
        )}

        <ChoiceButton
          text="Cette information n’est pas pertinente pour mon action"
          type="radio"
          selected={selected === null}
          onSelect={() => setSelected(null)}
          size="lg"
        />

        <div className="text-end mt-6">
          <Button icon="checkmark-circle-2" iconPlacement="end" onClick={validate}>
            Valider
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalPrice;
