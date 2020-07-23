import React from "react";
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
// @ts-ignore
import variables from "scss/colors.scss";
import { Props } from "./LeftSideDispositif.container";
import { DispositifContent } from "../../../../@types/interface";
import API from "../../../../utils/API";
import Swal from "sweetalert2";

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
  newRef: any;
  handleChange: () => void;
  typeContenu: string;
}
const send_sms = (typeContenu: string, titreInformatif: string) =>
  Swal.fire({
    title: "Veuillez renseigner votre numéro de téléphone",
    input: "tel",
    inputPlaceholder: "0633445566",
    inputAttributes: {
      autocomplete: "on",
    },
    showCancelButton: true,
    confirmButtonText: "Envoyer",
    cancelButtonText: "Annuler",
    showLoaderOnConfirm: true,
    preConfirm: (number: number) => {
      return API.send_sms({
        number,
        typeContenu,
        // @ts-ignore
        url: window.location.href,
        title: titreInformatif,
      })
        .then((response: { status: number; statusText: string; data: any }) => {
          if (response.status !== 200) {
            throw new Error(response.statusText);
          }
          return response.data;
        })
        .catch((error: Error) => {
          Swal.showValidationMessage(`Echec d'envoi: ${error}`);
        });
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        title: "Yay...",
        text: "Votre message a bien été envoyé, merci",
        type: "success",
        timer: 1500,
      });
    }
  });

export const LeftSideDispositif = (props: Props) => {
  const { t } = props;

  // when clicking on 'Voir le site'
  // if lecture mode : navigate to the link
  // if edition mode : modify the link
  const onLinkClicked = props.disableEdit
    ? () =>
        props.content.externalLink &&
        // @ts-ignore
        window.open(
          (props.content.externalLink.includes("http") ? "" : "http://") +
            props.content.externalLink,
          "_blank"
        )
    : props.toggleInputBtnClicked;
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
                  {item.title && t("Dispositif." + item.title, item.title)}
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
                  fill={variables.grisFonce}
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
                  fill={variables.grisFonce}
                />
              </InputGroup>
            ) : (
              <FButton
                type="theme"
                name="external-link-outline"
                onClick={onLinkClicked}
              >
                {t("Dispositif.Voir le site", "Voir le site")}
              </FButton>
            )}
          </div>
        )}
        {props.disableEdit && (
          <>
            <FButton
              type="light-action"
              onClick={props.createPdf}
              name="download-outline"
            >
              {t("Dispositif.Télécharger en PDF", "Télécharger en PDF")}
              {props.showSpinner && (
                <Spinner color="light" className="ml-8 small-spinner" />
              )}
            </FButton>
            <FButton
              type="light-action"
              href={
                "mailto:mail@example.org?subject=Dispositif" +
                (props.content && props.content.titreMarque
                  ? " - " + props.content.titreMarque
                  : "") +
                "&body=Le dispositif est disponible dans votre dossier téléchargement"
              }
              onClick={props.createPdf}
              name="paper-plane-outline"
            >
              {t("Dispositif.Envoyer par mail", "Envoyer par mail")}
            </FButton>
            <FButton
              type="light-action"
              onClick={() =>
                send_sms(props.typeContenu, props.content.titreInformatif)
              }
              name="smartphone-outline"
            >
              {t("Dispositif.Envoyer par SMS", "Envoyer par SMS")}
            </FButton>
            <ReactToPrint
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
