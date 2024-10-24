import { CreateDispositifRequest, Metadatas, priceDetails } from "@refugies-info/api-types";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Col, Row } from "reactstrap";
import PriceFree from "~/assets/dispositif/form-icons/price-free.svg";
import PricePay from "~/assets/dispositif/form-icons/price-pay.svg";
import NoIcon from "~/assets/dispositif/no-icon.svg";
import BaseModal from "~/components/UI/BaseModal";
import { cls } from "~/lib/classname";
import ChoiceButton from "../../ChoiceButton";
import DropdownModals from "../../DropdownModals";
import { InlineForm, SimpleFooter } from "../components";
import { dropdownOptions, help, helpPay } from "./data";
import { getInitialPrice, getInitialType, isPriceValue } from "./functions";
import styles from "./ModalPrice.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const ModalPrice = (props: Props) => {
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();
  const [selected, setSelected] = useState<"free" | "pay" | null | undefined>(
    getInitialPrice(getValues("metadatas.price")),
  );
  const [selectedPay, setSelectedPay] = useState<"once" | "between" | "free" | undefined>(
    getInitialType(getValues("metadatas.price")),
  );
  const [selectedRecurent, setSelectedRecurent] = useState<priceDetails>(
    getValues("metadatas.price.details") || "once",
  );
  const [priceStart, setPriceStart] = useState<number | undefined>(getValues("metadatas.price.values.0") || undefined);
  const [priceEnd, setPriceEnd] = useState<number | undefined>(getValues("metadatas.price.values.1") || undefined);

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
      setValue("metadatas.price", newPrice);
    }
    props.toggle();
  };

  const disabled = useMemo(() => {
    return (
      selected === undefined ||
      (selected === "pay" && selectedPay === undefined) ||
      (selected === "pay" && selectedPay === "once" && !priceStart) ||
      (selected === "pay" && selectedPay === "between" && (!priceStart || !priceEnd))
    );
  }, [selected, priceStart, selectedPay, priceEnd]);

  return (
    <BaseModal
      show={props.show}
      toggle={props.toggle}
      help={selected === "pay" ? helpPay : help}
      title="Faut-il payer pour accéder au dispositif ?"
    >
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
                  className={styles.choice}
                />
              </Col>
              <Col>
                <ChoiceButton
                  text="Fourchette"
                  type="radio"
                  selected={selectedPay === "between"}
                  onSelect={() => setSelectedPay("between")}
                  className={styles.choice}
                />
              </Col>
              <Col>
                <ChoiceButton
                  text="Montant libre"
                  type="radio"
                  selected={selectedPay === "free"}
                  onSelect={() => setSelectedPay("free")}
                  className={styles.choice}
                />
              </Col>
            </Row>
            {selectedPay === "once" && (
              <InlineForm className={cls(styles.inline_form, "mt-6")}>
                <span>
                  <input
                    type="number"
                    placeholder={"0"}
                    value={priceStart || ""}
                    onChange={(e: any) => (isPriceValue(e.target.value) ? setPriceStart(e.target.value) : null)}
                    className="spinner"
                  />
                </span>
                <p>€ (euros)</p>
                <DropdownModals<priceDetails>
                  options={dropdownOptions}
                  selected={selectedRecurent}
                  setSelected={(key: priceDetails) => setSelectedRecurent(key)}
                />
              </InlineForm>
            )}

            {selectedPay === "between" && (
              <InlineForm className={cls(styles.inline_form, "mt-6")}>
                <p>entre</p>
                <span>
                  <input
                    type="number"
                    placeholder={"0"}
                    value={priceStart || ""}
                    onChange={(e: any) => (isPriceValue(e.target.value) ? setPriceStart(e.target.value) : null)}
                    className="spinner"
                  />
                </span>
                <p>et</p>
                <span>
                  <input
                    type="number"
                    placeholder={"0"}
                    value={priceEnd || ""}
                    onChange={(e: any) => (isPriceValue(e.target.value) ? setPriceEnd(e.target.value) : null)}
                    className="spinner"
                  />
                </span>
                <p>€ (euros)</p>
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
          text="Ce n'est pas pertinent pour mon action"
          type="radio"
          selected={selected === null}
          onSelect={() => setSelected(null)}
          size="lg"
          image={NoIcon}
        />

        <SimpleFooter onValidate={validate} disabled={disabled} />
      </div>
    </BaseModal>
  );
};

export default ModalPrice;
