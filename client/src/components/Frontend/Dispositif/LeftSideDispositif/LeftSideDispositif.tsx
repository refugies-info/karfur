//@ts-nocheck TODO: delete
import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Spinner, InputGroup, Input } from "reactstrap";
import Scrollspy from "react-scrollspy";
import ReactToPrint from "react-to-print";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/UI/FButton/FButton";
import { colors } from "colors";
import { DispositifContent, Theme } from "types/interface";
import { send_sms } from "components/Pages/dispositif/function";
import { useTranslation } from "next-i18next";
import { Event } from "lib/tracking";
import { cls } from "lib/classname";
import styles from "./LeftSideDispositif.module.scss";

interface Props {
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
  createPdf: () => void;
  closePdf: () => void;
  newRef: any;
  handleChange: (ev: any) => void;
  typeContenu: string;
  toggleTutorielModal: (arg: string) => void;
  displayTuto: boolean;
  updateUIArray: (arg: number) => void;
  toggleShowPdfModal: () => void;
  mainTheme?: Theme;
}

const LeftSideDispositif = (props: Props) => {
  const { t } = useTranslation();
  const [emailBody, setEmailBody] = useState("Voici le lien vers cette fiche : ");

  // when clicking on 'Voir le site'
  // if lecture mode : navigate to the link
  // if edition mode : modify the link

  const onLinkClicked = props.disableEdit
    ? () =>
        props.content.externalLink &&
        window.open(
          (props.content.externalLink.includes("http") ? "" : "http://") + props.content.externalLink,
          "_blank"
        )
    : props.toggleInputBtnClicked;

  useEffect(() => {
    setEmailBody((emailBody) => emailBody + window.location.href);
  }, []);

  const getTitle = (title: string): string => {
    if (title === "La démarche par étapes") return t("Dispositif.Comment faire ?", "Comment faire ?");

    // @ts-ignore
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
      <ListGroup className={cls("list-group-flush", styles.list)}>
        <Scrollspy items={props.menu.map((_, key) => "item-" + key)} currentClassName="active" offset={-60}>
          {props.menu.map((item, key) => {
            return (
              <div key={key} className="list-item-wrapper">
                <ListGroupItem action tag="a" data-toggle="list" href={"#item-head-" + key}>
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
                <EVAIcon className="link-icon" name="link-outline" fill={colors.gray70} />
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
                  fill={colors.gray70}
                />
              </InputGroup>
            ) : (
              <div style={{ display: "flex", flexDirection: "row" }} onMouseEnter={() => props.updateUIArray(-2)}>
                {props.disableEdit && props.content.externalLink && (
                  <FButton
                    className="print_buttons_btn"
                    type={"theme"}
                    name="external-link-outline"
                    onClick={onLinkClicked}
                    theme={props.mainTheme?.colors.color100}
                    wrap
                  >
                    {t("Dispositif.Voir le site", "Voir le site")}
                  </FButton>
                )}
                {!props.disableEdit && (
                  <FButton
                    className="print_buttons_btn"
                    type={"edit"}
                    name="external-link-outline"
                    onClick={onLinkClicked}
                    wrap
                  >
                    {t("Dispositif.Ajouter votre site", "Ajouter votre site")}
                  </FButton>
                )}
                {!props.disableEdit && props.displayTuto && (
                  <FButton
                    type="tuto"
                    name={"play-circle-outline"}
                    className="print_buttons_btn ms-2"
                    onClick={() => props.toggleTutorielModal("WebsiteLink")}
                    wrap
                  />
                )}
              </div>
            )}
          </div>
        )}
        {props.disableEdit && (
          <>
            <FButton
              className="print_buttons_btn"
              type="light-action"
              name="download-outline"
              onClick={() => props.toggleShowPdfModal()}
              wrap
            >
              {t("Dispositif.Télécharger en PDF", "Télécharger en PDF")}
              {props.showSpinner && <Spinner color="light" className="ms-2 small-spinner" />}
            </FButton>
            <FButton
              className="print_buttons_btn"
              type="light-action"
              href={`mailto:?subject=${mailSubject}&body=${emailBody}`}
              name="paper-plane-outline"
              onClick={() => Event("Share", "Mail", "from dispositif sidebar")}
              wrap
            >
              {t("Dispositif.Envoyer par mail", "Envoyer par mail")}
            </FButton>
            <FButton
              className="print_buttons_btn"
              type="light-action"
              onClick={() => {
                Event("Share", "SMS", "from dispositif sidebar");
                send_sms("Veuillez renseigner votre numéro de téléphone", props.content.titreInformatif);
              }}
              name="smartphone-outline"
              wrap
            >
              {t("Dispositif.Envoyer par SMS", "Envoyer par SMS")}
            </FButton>
            <ReactToPrint
              onBeforeGetContent={() => {
                Event("Share", "Print", "from dispositif sidebar");
                props.createPdf();

                // give enough time for the accordions to open before printing
                return new Promise((resolve: any) => {
                  setTimeout(() => {
                    resolve();
                  }, 500);
                });
              }}
              onAfterPrint={() => {
                props.closePdf();
              }}
              trigger={() => (
                <FButton className="print_buttons_btn" type="light-action" name="printer-outline" wrap>
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

export default LeftSideDispositif;
