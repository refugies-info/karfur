import React from "react";
import { cardTitles } from "../data";
import { DispositifContent } from "../../../types/interface";
import { DropDownContent } from "./CardParagrapheComponents";
import FSwitch from "../../../components/FigmaUI/FSwitch/FSwitch";
import {
  Input,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import styled from "styled-components";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { getTextForAgeInfocard, jsUcfirstInfocards } from "./functions";
import ContentEditable from "react-contenteditable";

const TitleTextBody = styled.p`
  font-size: 22px;
  line-height: 20px;
  margin: 0;
  padding-bottom: 12px;
  padding-top: 10px;
  font-weight: 600;
  margin-top: ${(props) => props.mt || 0};
`;

const ButtonTextBody = styled.p`
  font-size: 22px;
  line-height: 20px;
  margin: 0;
`;

interface Props {
  subitem: DispositifContent;
  isOptionsOpen: boolean;
  toggleOptions: (e: any) => void;
  disableEdit: boolean;
  changeAge: (arg1: any, arg2: any, arg3: any, arg4: any) => void;
  changePrice: (arg1: any, arg2: any, arg3: any) => void;
  toggleFree: (arg1: number, arg2: number) => void;
  keyValue: number;
  subkey: number;
  t: any;
  typeContenu: "dispositif" | "demarche";
  toggleGeolocModal: (arg: boolean) => void;
  handleMenuChange: (arg1: any) => void;
  emptyPlaceholder: (e: any) => void;
}
const frequencesPay = [
  "une seule fois ",
  "à chaque fois",
  "par heure",
  "par semaine",
  "par mois",
  "par an",
];

export const CardBodyContent = (props: Props) => {
  let cardTitle = cardTitles.find((x) => x.title === props.subitem.title);
  // edition mode of cards with options
  // Public visé, Age requis, Niveau de français
  if (
    cardTitle &&
    cardTitle.options &&
    cardTitle.options.length > 0 &&
    !props.disableEdit &&
    props.subitem.title !== "Zone d'action"
  ) {
    return (
      <DropDownContent
        isOptionsOpen={props.isOptionsOpen}
        toggleOptions={props.toggleOptions}
        disableEdit={props.disableEdit}
        subitem={props.subitem}
        changeAge={props.changeAge}
        keyValue={props.keyValue}
        subkey={props.subkey}
        cardTitle={cardTitle}
        t={props.t}
      />
    );
    // case infocard Combien ça coute (lecture and edition)
  } else if (props.subitem.title === "Combien ça coûte ?") {
    return (
      <>
        {props.disableEdit ? (
          <div className="card-custom-title">
            {props.subitem.free
              ? props.t("Dispositif.Gratuit", "Gratuit")
              : props.t("Dispositif.Payant", "Payant")}
          </div>
        ) : (
          <FSwitch
            className="card-custom-title"
            precontent="Gratuit"
            content="Payant"
            checked={!props.subitem.free}
            onClick={() => props.toggleFree(props.keyValue, props.subkey)}
          />
        )}
        {!props.subitem.free && (
          <span className="color-darkColor price-details">
            {props.disableEdit ? (
              <span>{props.subitem.price}</span>
            ) : (
              <Input
                type="number"
                className="color-darkColor age-input"
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
              className="content-title price-frequency"
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
  } else if (props.subitem.title === "Zone d'action") {
    if (props.disableEdit) {
      return (
        <TitleTextBody>
          {props.subitem.departments && props.subitem.departments.length > 1
            ? props.t("Dispositif.Départements", "Départements")
            : props.subitem.departments &&
              props.subitem.departments[0] === "All"
            ? props.t("Dispositif.France entière", "France entière")
            : props.t("Dispositif.Département", "Département")}
        </TitleTextBody>
      );
    }

    if (!props.disableEdit && props.typeContenu === "dispositif") {
      return (
        <FButton
          type="precision"
          className={"mb-8"}
          //name="plus-circle-outline"
          onClick={() => props.toggleGeolocModal(true)}
        >
          <ButtonTextBody>{"Sélectionner"}</ButtonTextBody>
        </FButton>
      );
    }
  }

  let texte;
  if (props.subitem.title === "Âge requis") {
    if (props.subitem.ageTitle) {
      texte = getTextForAgeInfocard(
        props.subitem.ageTitle,
        props.subitem.bottomValue,
        props.subitem.topValue,
        props.t
      );
    } else {
      texte = getTextForAgeInfocard(
        props.subitem.contentTitle,
        props.subitem.bottomValue,
        props.subitem.topValue,
        props.t
      );
    }
  } else if (props.subitem.title === "Combien ça coûte ?") {
    texte = props.subitem.free
      ? props.t("Dispositif.gratuit", "gratuit")
      : props.subitem.price +
        " € " +
        props.t(
          "Dispositif." + props.subitem.contentTitle,
          props.subitem.contentTitle
        );
  } else if (cardTitle && cardTitle.options) {
    texte = jsUcfirstInfocards(
      props.t(
        "Dispositif." + props.subitem.contentTitle,
        props.subitem.contentTitle
      ),
      cardTitle.title
    );
  } else {
    texte = props.subitem.contentTitle;
  }

  // display infocards (except combien ça coute)
  // edition of infocards Important
  return (
    <ContentEditable
      //@ts-ignore
      id={props.keyValue}
      className="card-input"
      data-subkey={props.subkey}
      data-target="contentTitle"
      html={texte} // innerHTML of the editable div
      disabled={props.disableEdit} // use true to disable editing
      onChange={props.handleMenuChange} // handle innerHTML change
      onMouseUp={props.emptyPlaceholder}
    />
  );
};
