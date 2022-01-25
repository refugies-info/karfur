import React from "react";
import FSwitch from "components/FigmaUI/FSwitch/FSwitch";
import { DispositifContent } from "types/interface";
import {
  Input,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import parentStyles from "../CardParagraphe.module.scss";
import styles from "./CombienCaCouteContent.module.scss";

interface Props {
  disableEdit: boolean;
  subitem: DispositifContent;
  t: any;
  toggleFree: (arg1: number, arg2: number) => void;
  keyValue: number;
  subkey: number;
  changePrice: (arg1: any, arg2: any, arg3: any) => void;
  isOptionsOpen: boolean;
  toggleOptions: (e: any) => void;
}

const frequencesPay = [
  "une seule fois ",
  "à chaque fois",
  "par heure",
  "par semaine",
  "par mois",
  "par an",
];

export const CombienCaCouteContent = (props: Props) => {
  return (
    <>
      {props.disableEdit ? (
        <div className={parentStyles.card_title}>
          {props.subitem.free
            ? props.t("Dispositif.Gratuit", "Gratuit")
            : props.t("Dispositif.Payant", "Payant")}
        </div>
      ) : (
        <FSwitch
          large
          precontent="Gratuit"
          content="Payant"
          checked={!props.subitem.free}
          onClick={() => props.toggleFree(props.keyValue, props.subkey)}
        />
      )}
      {!props.subitem.free && (
        <span className={"color-darkColor " + styles.price_details}>
          {props.disableEdit ? (
            <span>{props.subitem.price}</span>
          ) : (
            <Input
              type="number"
              className={"color-darkColor " + parentStyles.age_input}
              disabled={props.disableEdit}
              value={props.subitem.price}
              onMouseUp={() =>
                (props.subitem || {}).isFakeContent &&
                props.changePrice(
                  { target: { value: "" } },
                  props.keyValue,
                  props.subkey
                )
              }
              onChange={(e) =>
                props.changePrice(e, props.keyValue, props.subkey)
              }
            />
          )}
          <span>€ </span>
          <ButtonDropdown
            isOpen={!props.disableEdit && props.isOptionsOpen}
            toggle={props.toggleOptions}
            className={`${parentStyles.content_title} ${styles.price_frequency}`}
          >
            <DropdownToggle caret={!props.disableEdit}>
              <span>
                {props.subitem.contentTitle &&
                  props.t(
                    "Dispositif." + props.subitem.contentTitle,
                    props.subitem.contentTitle
                  )}
              </span>
            </DropdownToggle>
            <DropdownMenu>
              {frequencesPay.map((f, key) => (
                //@ts-ignore
                // eslint-disable-next-line react/jsx-no-undef
                <DropdownItem key={key} id={key}>
                  {f}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </ButtonDropdown>
        </span>
      )}
    </>
  );
};
