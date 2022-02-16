import React, { Component } from "react";
import { Col, Card, CardBody, CardHeader, CardFooter } from "reactstrap";
import Swal from "sweetalert2";
import _ from "lodash";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import { Props } from "./CardParagraphe.container";
import { DispositifContent, Tag } from "types/interface";
import { cardTitlesDispositif, cardTitlesDemarche, ShortContent } from "data/dispositif";
import { FrenchLevelModal } from "../FrenchLevelModal";
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

// difficult to type
type Element = any;


export interface PropsBeforeInjection {
  subkey: number;
  keyValue: number;
  updateUIArray: (
    key: number,
    arg: number|null,
    variante: string,
    option?: boolean
  ) => void;
  handleMenuChange: (ev: any, value?: any) => any
  subitem: DispositifContent;
  content: ShortContent;
  cards: string[];
  admin: boolean;
  showGeolocModal: boolean;
  typeContenu: "dispositif" | "demarche";
  disableEdit: boolean;
  mainTag: Tag;
  t: any;
  toggleTutorielModal: (arg: string) => void;
  toggleGeolocModal: (arg1: boolean) => void;
  changeTitle: (arg1: number, arg2: number, arg3: string, arg4: string) => void;
  changeAge: (arg1: any, arg2: number, arg3: number, arg4: boolean) => void;
  changeDepartements: (arg1: string[], arg2: number, arg3: number) => void;
  changePrice: (arg1: any, arg2: number, arg3: number) => void;
  toggleFree: (arg1: number, arg2: number) => void;
  toggleNiveau: (arg1: string[], arg2: number, arg3: number) => void;
  deleteCard: (key: any, subkey: any, type?: any) => void
}
type StateType = {
  isDropdownOpen: boolean;
  isOptionsOpen: boolean;
  tooltipOpen: boolean;
  showFrenchLevelModal: boolean;
};
export class CardParagraphe extends Component<Props> {
  state: StateType = {
    isDropdownOpen: false,
    isOptionsOpen: false,
    tooltipOpen: false,
    showFrenchLevelModal: false,
  };

  validateLevels = (selectedLevels: string[]) => {
    this.props.toggleNiveau(
      selectedLevels,
      this.props.keyValue,
      this.props.subkey
    );
  };

  onValidateGeoloc = (dispositifId: string, subitem: any) => {
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

  validateDepartments = (departments: string[]) => {
    this.props.changeDepartements(
      departments,
      this.props.keyValue,
      this.props.subkey
    );
  };

  toggleTooltip = () =>
    this.setState((prevState: StateType) => ({
      tooltipOpen: !prevState.tooltipOpen,
    }));

  toggleDropdown = (e: Element) => {
    if (this.state.isDropdownOpen && e.currentTarget.id) {
      this.props.changeTitle(
        this.props.keyValue,
        this.props.subkey,
        "title",
        e.target.innerText
      );
    }
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  };

  emptyPlaceholder = (e: Element) => {
    if (!this.props.disableEdit && (this.props.subitem || {}).isFakeContent) {
      this.props.handleMenuChange({
        currentTarget: e.currentTarget,
        target: { value: "" },
      });
    }
  };
  toggleFrenchLevelModal = (show: boolean) =>
    this.setState({ showFrenchLevelModal: show });

  toggleOptions = (e: Element) => {
    if (this.state.isOptionsOpen && e.currentTarget.id) {
      this.props.changeTitle(
        this.props.keyValue,
        this.props.subkey,
        "contentTitle",
        e.target.innerText
      );
    }
    this.setState({ isOptionsOpen: !this.state.isOptionsOpen });
  };

  footerClicked = (subitem: DispositifContent) => {
    // the only infocard with footerHref is 'Niveaux de français'
    if (subitem.title === "Niveau de français") {
      this.toggleFrenchLevelModal(true);
    } else {
      Swal.fire({
        title: "Oh non!",
        text: "Cette fonctionnalité n'est pas encore activée",
        type: "error",
        timer: 1500,
      });
    }
  };

  render() {
    const { subitem, subkey, disableEdit } = this.props;

    let dispositifId = "";
/*     if (this.props.location.pathname) { // TODO
      let pathVariables = this.props.location.pathname.split("/");
      if (pathVariables.length === 3 && pathVariables[1] === "dispositif") {
        dispositifId = pathVariables[2];
      }
    } */

    // filter cards to have maximum one infocard by category
    const availablecardTitles =
      this.props.typeContenu === "dispositif"
        ? cardTitlesDispositif.filter(
            (x) => !this.props.cards.includes(x.title)
          )
        : cardTitlesDemarche.filter((x) => !this.props.cards.includes(x.title));

    const computeCardClassName = () => {
      const safeMainTag =
        _.isEmpty(this.props.mainTag) || !this.props.mainTag.short
          ? "noImage"
          : this.props.mainTag.short.replace(/ /g, "-");

      const className =
        (subitem.title || "")
          .replace(/ /g, "-")
          .replace("-?", "")
          .replace("-!", "")
          .replace("'", "-") +
        "-" +
        safeMainTag;

      if (subitem.title === "Combien ça coûte ?")
        return styles[className + "-" + subitem.free];
      return styles[className];
    };

    // returns infocards using components defined above, mainly header, content and title
    return (
      <>
        <Col
          className={styles.card_col}
          onMouseEnter={() =>
            this.props.updateUIArray(
              this.props.keyValue,
              this.props.subkey,
              "isHover"
            )
          }
        >
          <Card
            className={[styles.card, computeCardClassName()].join(" ")}
            id={"info-card-" + this.props.keyValue + "-" + subkey}
          >
            <CardHeader
              className={styles.card_header + " bg-darkColor"}
              style={{ backgroundColor: this.props.mainTag.darkColor }}
            >
              <CardHeaderContent
                subitem={subitem}
                disableEdit={disableEdit}
                availablecardTitles={availablecardTitles}
                t={this.props.t}
                isDropdownOpen={this.state.isDropdownOpen}
                toggleDropdown={this.toggleDropdown}
                typeContenu={this.props.typeContenu}
              />
            </CardHeader>
            <CardBody className={styles.card_body}>
              <span
                className={styles.card_title}
                style={{ color: this.props.mainTag.darkColor }}
              >
                <CardBodyContent
                  subitem={subitem}
                  isOptionsOpen={this.state.isOptionsOpen}
                  toggleOptions={this.toggleOptions}
                  disableEdit={this.props.disableEdit}
                  changeAge={this.props.changeAge}
                  changePrice={this.props.changePrice}
                  toggleFree={this.props.toggleFree}
                  keyValue={this.props.keyValue}
                  subkey={this.props.subkey}
                  t={this.props.t}
                  typeContenu={this.props.typeContenu}
                  toggleGeolocModal={this.props.toggleGeolocModal}
                  handleMenuChange={this.props.handleMenuChange}
                  emptyPlaceholder={this.emptyPlaceholder}
                  mainTag={this.props.mainTag}
                />
              </span>

              {subitem.title === "Niveau de français" &&
                (subitem.niveaux || []).length > 0 && (
                  <FrenchCECRLevel subitem={subitem} mainTag={this.props.mainTag} />
                )}
              {subitem.title === "Zone d'action" &&
                (subitem.departments || []).length > 0 && (
                  <DepartmentsSelected
                    subitem={subitem}
                    disableEdit={disableEdit}
                    mainTag={this.props.mainTag}
                  />
                )}
              <AdminGeolocPublicationButton
                admin={this.props.admin}
                subitem={subitem}
                dispositifId={dispositifId}
                disableEdit={this.props.disableEdit}
                onValidateGeoloc={this.onValidateGeoloc}
              />
            </CardBody>
            {
              // footer for card Niveau de français to assess level in a website
              <CardFooter className={styles.card_footer}>
                <CardFooterContent
                  subitem={subitem}
                  disableEdit={disableEdit}
                  footerClicked={this.footerClicked}
                  t={this.props.t}
                  toggleFrenchLevelModal={this.toggleFrenchLevelModal}
                />
              </CardFooter>
            }
            {
              // deletion of an infocard in edit mode except for zone d'action in demarche
              !this.props.disableEdit &&
                !(
                  this.props.typeContenu === "demarche" &&
                  subitem.title === "Zone d'action"
                ) && (
                  <div className={styles.card_icons}>
                    <div
                      onClick={() =>
                        this.props.deleteCard(this.props.keyValue, subkey)
                      }
                    >
                      <EVAIcon
                        size="xlarge"
                        name="close-circle"
                        fill={colors.noirCD}
                      />
                    </div>
                  </div>
                )
            }
          </Card>
        </Col>
        {!isMobile && (
          <FrenchLevelModal
            show={this.state.showFrenchLevelModal}
            disableEdit={this.props.disableEdit}
            hideModal={() => this.toggleFrenchLevelModal(false)}
            selectedLevels={subitem.niveaux}
            validateLevels={this.validateLevels}
            t={this.props.t}
          />
        )}
        {subitem.title === "Zone d'action" ? (
          <GeolocModal
            validateDepartments={this.validateDepartments}
            departments={subitem.departments}
            hideModal={() => this.props.toggleGeolocModal(false)}
            show={this.props.showGeolocModal}
            toggleTutorielModal={this.props.toggleTutorielModal}
          />
        ) : null}
      </>
    );
  }
}
