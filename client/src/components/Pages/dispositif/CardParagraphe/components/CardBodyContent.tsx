import React from "react";
import { cardTitlesDispositif } from "data/dispositif";
import { DispositifContent, Tag } from "types/interface";
import { DropDownContent } from "./CardParagrapheComponents";

import styled from "styled-components";
import FButton from "components/FigmaUI/FButton/FButton";
import { getTextForAgeInfocard, jsUcfirstInfocards } from "./functions";
import ContentEditable from "react-contenteditable";
import { CombienCaCouteContent } from "./CombienCaCouteContent";
import styles from "./CardBodyContent.module.scss";

const TitleTextBody = styled.p`
  font-size: 22px;
  line-height: 20px;
  margin: 0;
  padding-bottom: 12px;
  padding-top: 10px;
  font-weight: 600;
  margin-top: ${(props: {mt?: string}) => props.mt || 0};
`;

const ButtonTextBody = styled.p`
  font-size: 22px;
  line-height: 20px;
  margin: 0;
`;

interface Props {
  subitem: DispositifContent;
  isOptionsOpen: boolean;
  toggleOptions: any;
  disableEdit: boolean;
  changeAge: (arg1: any, arg2: any, arg3: any, arg4: any) => void;
  changePrice: (arg1: any, arg2: any, arg3: any) => void;
  toggleFree: (arg1: number, arg2: number) => void;
  keyValue: number;
  subkey: number;
  t: any;
  typeContenu: "dispositif" | "demarche";
  toggleGeolocModal: (arg: boolean) => void;
  handleMenuChange: (ev: any, value?: any) => any
  emptyPlaceholder: (e: any) => void;
  mainTag: Tag;
}

export const CardBodyContent = (props: Props) => {
  let cardTitle = cardTitlesDispositif.find(
    (x) => x.title === props.subitem.title
  );

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
        mainTag={props.mainTag}
        t={props.t}
      />
    );
  }

  // case infocard Combien ça coute (lecture and edition)
  if (props.subitem.title === "Combien ça coûte ?") {
    return (
      <CombienCaCouteContent
        disableEdit={props.disableEdit}
        subitem={props.subitem}
        t={props.t}
        toggleFree={props.toggleFree}
        keyValue={props.keyValue}
        subkey={props.subkey}
        changePrice={props.changePrice}
        isOptionsOpen={props.isOptionsOpen}
        toggleOptions={props.toggleOptions}
        mainTag={props.mainTag}
      />
    );
  }

  // case zone d action edition and lecture
  if (props.subitem.title === "Zone d'action") {
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
    // no possibility to modify zone d'action in edit mode for demarche
    if (!props.disableEdit && props.typeContenu === "demarche") {
      return <div />;
    }
  }

  if (
    props.subitem.title && ["Titre de séjour", "Acte de naissance OFPRA"].includes(props.subitem.title)
  ) {
    return (
      <div>
        {props.t("Dispositif." + props.subitem.title, props.subitem.title)}
      </div>
    );
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

  // display content of infocards in lecture : Important, Durée, Public visé, Age requis, Niveau de français
  // edition of infocards Important and Durée
  return (
    <ContentEditable
      //@ts-ignore
      id={props.keyValue}
      data-subkey={props.subkey}
      data-target="contentTitle"
      html={texte} // innerHTML of the editable div
      disabled={props.disableEdit} // use true to disable editing
      onChange={props.handleMenuChange} // handle innerHTML change
      onMouseUp={props.emptyPlaceholder}
    />
  );
};
