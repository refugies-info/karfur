// @ts-nocheck
import React, { useState } from "react";
import {
  ListGroup,
  ListGroupItem,
  Spinner,
  InputGroup,
  Input,
} from "reactstrap";
import Scrollspy from "react-scrollspy";
import ReactToPrint from "react-to-print";

import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import FButton from "../../../FigmaUI/FButton/FButton";
import { colors } from "colors";
import { Props } from "./LeftSideDispositif.container";
import { DispositifContent } from "../../../../types/interface";
import API from "../../../../utils/API";
import Swal from "sweetalert2";
import { send_sms } from "../../../../containers/Dispositif/function";

declare const window: Window;
export interface PropsBeforeInjection {
  t: any;
  menu: DispositifContent[];
  showSpinner: boolean;
  content: {
    titreInformatif: string;
    titreMarque: string;
    abstract: string;
    contact: string;
    externalLink: string;
  };
  inputBtnClicked: boolean;
  disableEdit: boolean;
  toggleInputBtnClicked: () => void;
  handleScrollSpy: () => void;
  createPdf: () => void;
  closePdf: () => void;
  newRef: any;
  handleChange: () => void;
  typeContenu: string;
  toggleTutorielModal: (arg: string) => void;
  displayTuto: boolean;
  updateUIArray: (arg: number) => void;
  toggleShowPdfModal: () => void;
}

export const LeftSideDispositif = (props: Props) => {
  const { t } = props;

  // when clicking on 'Voir le site'
  // if lecture mode : navigate to the link
  // if edition mode : modify the link

  const onLinkClicked = props.disableEdit
    ? () =>
        props.content.externalLink &&
        window.open(
          (props.content.externalLink.includes("http") ? "" : "http://") +
            props.content.externalLink,
          "_blank"
        )
    : props.toggleInputBtnClicked;

  const emailBody = "Voici le lien vers cette fiche : " + window.location.href;

  const getTitle = (title: string) => {
    if (title === "La démarche par étapes")
      return t("Dispositif.Comment faire ?", "Comment faire ?");

    return t("Dispositif." + title, title);
  };
  const mailSubject = props.content
    ? props.typeContenu === "dispositif"
      ? `${props.content.titreInformatif} avec ${props.content.titreMarque}`
      : `${props.content.titreInformatif}`
    : "";

  return (
    // left part of a demarche or dispositif to navigate to sections
    <div className="sticky-affix">
      <ListGroup className="list-group-flush">
        <Scrollspy
          items={props.menu.map((_, key) => "item-" + key)}
          currentClassName="active"
          onUpdate={props.handleScrollSpy}
          offset={-60}
        >
          {props.menu.map((item, key) => {
            return (
              <div key={key} className="list-item-wrapper">
                <ListGroupItem
                  action
                  tag="a"
                  data-toggle="list"
                  href={"#item-head-" + key}
                >
                  {/* {item.title && t("Dispositif." + item.title, item.title)} */}
                  {item.title && getTitle(item.title)}
                </ListGroupItem>
              </div>
            );
          })}
        </Scrollspy>
      </ListGroup>
      <div className="print-buttons">
        {props.typeContenu !== "demarche" && (
          <div className="link-wrapper" id="input-btn">
            {props.inputBtnClicked ? (
              <InputGroup className="input-btn">
                <EVAIcon
                  className="link-icon"
                  name="link-outline"
                  fill={colors.grisFonce}
                />
                <Input
                  value={props.content.externalLink}
                  onChange={props.handleChange}
                  placeholder="Lien vers votre site"
                  id="externalLink"
                />
                <EVAIcon
                  onClick={onLinkClicked}
                  className="check-icon"
                  name="checkmark-circle-2"
                  fill={colors.grisFonce}
                />
              </InputGroup>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "row" }}
                onMouseEnter={() => props.updateUIArray(-2)}
              >
                {props.disableEdit && props.content.externalLink && (
                  <FButton
                    type={"theme"}
                    name="external-link-outline"
                    onClick={onLinkClicked}
                  >
                    {t("Dispositif.Voir le site", "Voir le site")}
                  </FButton>
                )}
                {!props.disableEdit && (
                  <FButton
                    type={"edit"}
                    name="external-link-outline"
                    onClick={onLinkClicked}
                  >
                    {t("Dispositif.Ajouter votre site", "Ajouter votre site")}
                  </FButton>
                )}
                {!props.disableEdit && props.displayTuto && (
                  <FButton
                    type="tuto"
                    name={"play-circle-outline"}
                    className="ml-8"
                    onClick={() => props.toggleTutorielModal("WebsiteLink")}
                  />
                )}
              </div>
            )}
          </div>
        )}
        {props.disableEdit && (
          <>
            <FButton
              type="light-action"
              name="download-outline"
              onClick={() => props.toggleShowPdfModal()}
            >
              {t("Dispositif.Télécharger en PDF", "Télécharger en PDF")}
              {props.showSpinner && (
                <Spinner color="light" className="ml-8 small-spinner" />
              )}
            </FButton>
            <FButton
              type="light-action"
              href={`mailto:?subject=${mailSubject}&body=${emailBody}`}
              name="paper-plane-outline"
            >
              {t("Dispositif.Envoyer par mail", "Envoyer par mail")}
            </FButton>
            <FButton
              type="light-action"
              onClick={() =>
                send_sms(
                  "Veuillez renseigner votre numéro de téléphone",
                  props.typeContenu,
                  props.content.titreInformatif
                )
              }
              name="smartphone-outline"
            >
              {t("Dispositif.Envoyer par SMS", "Envoyer par SMS")}
            </FButton>
            <ReactToPrint
              onBeforeGetContent={async () => {
                await props.createPdf();
              }}
              onAfterPrint={() => {
                props.closePdf();
              }}
              trigger={() => (
                <FButton type="light-action" name="printer-outline">
                  {t("Dispositif.Imprimer", "Imprimer")}
                </FButton>
              )}
              content={() => props.newRef.current}
            />{" "}
          </>
        )}
      </div>
    </div>
  );
};
