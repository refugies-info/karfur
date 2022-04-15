import React, { useState } from "react";
import { Col, Card, CardBody, CardHeader, CardFooter } from "reactstrap";
import Swal from "sweetalert2";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import { DispositifContent, Tag } from "types/interface";
import {
  cardTitlesDispositif,
  cardTitlesDemarche,
  ShortContent,
} from "data/dispositif";
import FrenchLevelModal from "../FrenchLevelModal";
import GeolocModal from "components/Modals/GeolocModal/GeolocModal";
import API from "utils/API";
import {
  FrenchCECRLevel,
  DepartmentsSelected,
  AdminGeolocPublicationButton,
} from "./components/CardParagrapheComponents";

import { CardBodyContent } from "./components/CardBodyContent";
import { CardFooterContent } from "./components/CardFooterContent";
import { CardHeaderContent } from "./components/CardHeaderContent";
import { isMobile } from "react-device-detect";
import styles from "./CardParagraphe.module.scss";
import { cls } from "lib/classname";
import { UiElementNodes } from "services/SelectedDispositif/selectedDispositif.reducer";

// difficult to type
type Element = any;

interface Props {
  subkey: number;
  keyValue: number;
  dispositifId?: string;
  updateUIArray: (
    key: number,
    arg: number | null,
    variante: UiElementNodes,
    option?: boolean
  ) => void;
  handleMenuChange: (ev: any, value?: any) => any;
  subitem: DispositifContent;
  content: ShortContent;
  cards: string[];
  admin: boolean;
  showGeolocModal: boolean;
  typeContenu: "dispositif" | "demarche";
  disableEdit: boolean;
  mainTag: Tag;
  visibleOnMobile?: boolean;
  toggleTutorielModal: (arg: string) => void;
  toggleGeolocModal: (arg1: boolean) => void;
  changeTitle: (arg1: number, arg2: number, arg3: string, arg4: string) => void;
  changeAge: (arg1: any, arg2: number, arg3: number, arg4: boolean) => void;
  changeDepartements: (arg1: string[], arg2: number, arg3: number) => void;
  changePrice: (arg1: any, arg2: number, arg3: number) => void;
  toggleFree: (arg1: number, arg2: number) => void;
  toggleNiveau: (arg1: string[], arg2: number, arg3: number) => void;
  deleteCard: (key: any, subkey: any, type?: any) => void;
}

const CardParagraphe = (props: Props) => {
  const { t } = useTranslation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [showFrenchLevelModal, setShowFrenchLevelModal] = useState(false);

  const validateLevels = (selectedLevels: string[]) => {
    props.toggleNiveau(selectedLevels, props.keyValue, props.subkey);
  };

  const onValidateGeoloc = (dispositifId: string, subitem: any) => {
    let dispositif = {
      dispositifId,
      geolocInfocard: subitem,
    };
    API.add_dispositif_infocards(dispositif)
      .then(() => {
        Swal.fire({
          title: "Yay...",
          text: "Enregistrement reussi",
          type: "success",
          timer: 1500,
        });
      })
      .catch(() => {
        Swal.fire({
          title: "Oh non!",
          text: "Something went wrong",
          type: "error",
          timer: 1500,
        });
      });
  };

  const validateDepartments = (departments: string[]) => {
    props.changeDepartements(departments, props.keyValue, props.subkey);
  };

  const toggleDropdown = (e: Element) => {
    if (isDropdownOpen && e.currentTarget.id) {
      props.changeTitle(
        props.keyValue,
        props.subkey,
        "title",
        e.target.innerText
      );
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const emptyPlaceholder = (e: Element) => {
    if (!props.disableEdit && (props.subitem || {}).isFakeContent) {
      props.handleMenuChange({
        currentTarget: e.currentTarget,
        target: { value: "" },
      });
    }
  };
  const toggleFrenchLevelModal = (show: boolean) =>
    setShowFrenchLevelModal(show);

  const toggleOptions = (e: Element) => {
    if (isOptionsOpen && e.currentTarget.id) {
      props.changeTitle(
        props.keyValue,
        props.subkey,
        "contentTitle",
        e.target.innerText
      );
    }
    setIsOptionsOpen(!isOptionsOpen);
  };

  const footerClicked = (subitem: DispositifContent) => {
    // the only infocard with footerHref is 'Niveaux de français'
    if (subitem.title === "Niveau de français") {
      toggleFrenchLevelModal(true);
    } else {
      Swal.fire({
        title: "Oh non!",
        text: "Cette fonctionnalité n'est pas encore activée",
        type: "error",
        timer: 1500,
      });
    }
  };

  // filter cards to have maximum one infocard by category
  const availablecardTitles =
    props.typeContenu === "dispositif"
      ? cardTitlesDispositif.filter((x) => !props.cards.includes(x.title))
      : cardTitlesDemarche.filter((x) => !props.cards.includes(x.title));

  const computeCardClassName = () => {
    const safeMainTag =
      _.isEmpty(props.mainTag) || !props.mainTag.short
        ? "noImage"
        : props.mainTag.short.replace(/ /g, "-");

    const className =
      (props.subitem.title || "")
        .replace(/ /g, "-")
        .replace("-?", "")
        .replace("-!", "")
        .replace("'", "-") +
      "-" +
      safeMainTag;

    if (props.subitem.title === "Combien ça coûte ?")
      //@ts-ignore
      return styles[className + "-" + props.subitem.free];
    //@ts-ignore
    return styles[className];
  };

  // returns infocards using components defined above, mainly header, content and title
  return (
    <>
      <Col
        className={styles.card_col}
        onMouseEnter={() =>
          props.updateUIArray(props.keyValue, props.subkey, "isHover")
        }
      >
        <Card
          className={cls(styles.card, computeCardClassName())}
          id={"info-card-" + props.keyValue + "-" + props.subkey}
        >
          <CardHeader
            className={styles.card_header + " bg-darkColor"}
            style={{ backgroundColor: props.mainTag.darkColor }}
          >
            <CardHeaderContent
              subitem={props.subitem}
              disableEdit={props.disableEdit}
              availablecardTitles={availablecardTitles}
              t={t}
              isDropdownOpen={isDropdownOpen}
              toggleDropdown={toggleDropdown}
              typeContenu={props.typeContenu}
            />
          </CardHeader>
          <CardBody className={styles.card_body}>
            <span
              className={styles.card_title}
              style={{ color: props.mainTag.darkColor }}
            >
              <CardBodyContent
                subitem={props.subitem}
                isOptionsOpen={isOptionsOpen}
                toggleOptions={toggleOptions}
                disableEdit={props.disableEdit}
                changeAge={props.changeAge}
                changePrice={props.changePrice}
                toggleFree={props.toggleFree}
                keyValue={props.keyValue}
                subkey={props.subkey}
                t={t}
                typeContenu={props.typeContenu}
                toggleGeolocModal={props.toggleGeolocModal}
                handleMenuChange={props.handleMenuChange}
                emptyPlaceholder={emptyPlaceholder}
                mainTag={props.mainTag}
                visibleOnMobile={props.visibleOnMobile}
              />
            </span>

            {props.subitem.title === "Niveau de français" &&
              (props.subitem.niveaux || []).length > 0 && (
                <FrenchCECRLevel
                  subitem={props.subitem}
                  mainTag={props.mainTag}
                />
              )}
            {props.subitem.title === "Zone d'action" &&
              (props.subitem.departments || []).length > 0 && (
                <DepartmentsSelected
                  subitem={props.subitem}
                  disableEdit={props.disableEdit}
                  mainTag={props.mainTag}
                />
              )}
            <AdminGeolocPublicationButton
              admin={props.admin}
              subitem={props.subitem}
              dispositifId={props.dispositifId || ""}
              disableEdit={props.disableEdit}
              onValidateGeoloc={onValidateGeoloc}
            />
          </CardBody>
          {
            // footer for card Niveau de français to assess level in a website
            <CardFooter className={styles.card_footer}>
              <CardFooterContent
                subitem={props.subitem}
                disableEdit={props.disableEdit}
                footerClicked={footerClicked}
                t={t}
                toggleFrenchLevelModal={toggleFrenchLevelModal}
              />
            </CardFooter>
          }
          {
            // deletion of an infocard in edit mode except for zone d'action in demarche
            !props.disableEdit &&
              !(
                props.typeContenu === "demarche" &&
                props.subitem.title === "Zone d'action"
              ) && (
                <div className={styles.card_icons}>
                  <div
                    onClick={() =>
                      props.deleteCard(props.keyValue, props.subkey)
                    }
                  >
                    <EVAIcon
                      size="xlarge"
                      name="close-circle"
                      fill={colors.gray50}
                    />
                  </div>
                </div>
              )
          }
        </Card>
      </Col>
      {!isMobile && (
        <FrenchLevelModal
          show={showFrenchLevelModal}
          disableEdit={props.disableEdit}
          hideModal={() => toggleFrenchLevelModal(false)}
          selectedLevels={props.subitem.niveaux}
          validateLevels={validateLevels}
        />
      )}
      {props.subitem.title === "Zone d'action" ? (
        <GeolocModal
          validateDepartments={validateDepartments}
          departments={props.subitem.departments}
          hideModal={() => props.toggleGeolocModal(false)}
          show={props.showGeolocModal}
          toggleTutorielModal={props.toggleTutorielModal}
        />
      ) : null}
    </>
  );
};

export default CardParagraphe;
