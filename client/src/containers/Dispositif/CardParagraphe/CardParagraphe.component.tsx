/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { Component } from "react";
import {
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from "reactstrap";
import ContentEditable from "react-contenteditable";
import Swal from "sweetalert2";
import styled from "styled-components";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import FSwitch from "../../../components/FigmaUI/FSwitch/FSwitch";

import "./CardParagraphe.scss";
import { colors } from "colors";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { Props } from "./CardParagraphe.container";
import { DispositifContent, Tag } from "../../../types/interface";
import { filtres, cardTitles } from "../data";
import _ from "lodash";
import { infoCardIcon } from "../../../components/Icon/Icon";
import { FrenchLevelModal } from "../FrenchLevelModal";
import GeolocModal from "../../../components/Modals/GeolocModal/GeolocModal";
import API from "../../../utils/API";
import {
  GeolocTooltipItem,
  DropDownContent,
  FrenchCECRLevel,
  DepartmentsSelected,
  AdminGeolocPublicationButton,
} from "./CardParagrapheComponents";
import { jsUcfirstInfocards, getTextForAgeInfocard } from "./functions";
import { CardBodyContent } from "./CardBodyContent";

// difficult to type
type Element = any;

interface Content {
  abstract: string;
  contact: string;
  externalLink: string;
  titreInformatif: string;
  titreMarque: string;
}

const ButtonText = styled.p`
  font-size: 16px;
  line-height: 20px;
  margin: 0;
`;

export interface PropsBeforeInjection {
  subkey: number;
  subitem: DispositifContent;
  disableEdit: boolean;
  changeTitle: (arg1: number, arg2: number, arg3: string, arg4: string) => void;
  handleMenuChange: (arg1: any) => void;
  filtres: typeof filtres;
  changeAge: (arg1: any, arg2: number, arg3: number, arg4: boolean) => void;
  toggleFree: (arg1: number, arg2: number) => void;
  changePrice: (arg1: any, arg2: number, arg3: number) => void;
  updateUIArray: (arg1: number, arg2: number, arg3: string) => void;
  toggleNiveau: (arg1: string[], arg2: number, arg3: number) => void;
  changeDepartements: (arg1: string[], arg2: number, arg3: number) => void;
  deleteCard: (arg1: number, arg2: number) => void;
  content: Content;
  keyValue: number;
  t: any;
  cards: string[];
  mainTag: Tag;
  toggleTutorielModal: () => void;
  location: any;
  admin: boolean;
  toggleGeolocModal: (arg1: boolean) => void;
  showGeolocModal: boolean;
  typeContenu: "dispositif" | "demarche";
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
    const { subitem, subkey, disableEdit, t } = this.props;

    let dispositifId = "";
    if (this.props.location.pathname) {
      let pathVariables = this.props.location.pathname.split("/");
      if (pathVariables.length === 3 && pathVariables[1] === "dispositif") {
        dispositifId = pathVariables[2];
      }
    }

    // filter cards to have maximum one infocard by category
    const availableCardTitles = cardTitles.filter(
      (x) => !this.props.cards.includes(x.title)
    );

    const cardHeaderContent = (subitem: DispositifContent) => {
      // in lecture mode, display title and icon or in edition when all types of infocard are already displayed
      if (this.props.disableEdit || availableCardTitles.length === 0) {
        return (
          <>
            {infoCardIcon(subitem.titleIcon, "#FFFFFF")}
            <span className="header-content">
              {subitem.title && t("Dispositif." + subitem.title, subitem.title)}
            </span>
          </>
        );
      }
      // in edition mode
      return (
        <ButtonDropdown
          isOpen={this.state.isDropdownOpen}
          toggle={this.toggleDropdown}
        >
          {
            // title and icon
            <DropdownToggle
              caret={!this.props.disableEdit}
              className="header-value"
            >
              <div className="icon-title">
                {infoCardIcon(subitem.titleIcon, "#FFFFFF")}
                <span className="header-content">{subitem.title}</span>
              </div>
            </DropdownToggle>
          }
          <DropdownMenu>
            {
              // drop down with the list of possible info cards
              availableCardTitles.map((cardTitle, key) => {
                return (
                  <DropdownItem
                    key={key}
                    // @ts-ignore
                    id={key}
                  >
                    <div className="icon-title">
                      {infoCardIcon(cardTitle.titleIcon)}
                      <span className="header-content">{cardTitle.title}</span>
                    </div>
                  </DropdownItem>
                );
              })
            }
          </DropdownMenu>
        </ButtonDropdown>
      );
    };

    const computeCardClassName = () => {
      const safeMainTag =
        _.isEmpty(this.props.mainTag) || !this.props.mainTag.short
          ? "noImage"
          : this.props.mainTag.short.replace(/ /g, "-");

      const className =
        subitem.title
          .replace(/ /g, "-")
          .replace("-?", "")
          .replace("-!", "")
          .replace("'", "-") +
        "-" +
        safeMainTag;

      if (subitem.title === "Combien ça coûte ?")
        return className + "-" + subitem.free;
      return className;
    };

    const cardFooterContent = (subitem: DispositifContent) => {
      // in lecture mode, display button with a link to evaluate french level in infocard Niveau de français
      if (subitem.title === "Niveau de français" && disableEdit) {
        return (
          <FButton
            type="light-action"
            name={subitem.footerIcon}
            onClick={() => this.footerClicked(subitem)}
          >
            {subitem.footer &&
              t("Dispositif." + subitem.footer, subitem.footer)}
          </FButton>
        );
      }

      if (!disableEdit && subitem.title === "Niveau de français") {
        return (
          <FButton
            type="precision"
            name="plus-circle-outline"
            onClick={() => this.toggleFrenchLevelModal(true)}
          >
            <ButtonText>Préciser le niveau</ButtonText>
          </FButton>
        );
      }
      return false;
    };
    // returns infocards using components defined above, mainly header, content and title
    return (
      <>
        <Col
          className="card-col"
          onMouseEnter={() =>
            this.props.updateUIArray(
              this.props.keyValue,
              this.props.subkey,
              "isHover"
            )
          }
        >
          <Card
            className={computeCardClassName()}
            id={"info-card-" + this.props.keyValue + "-" + subkey}
          >
            <CardHeader className="backgroundColor-darkColor">
              {cardHeaderContent(subitem)}
            </CardHeader>
            <CardBody>
              <span className="color-darkColor card-custom-title">
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
                />
              </span>

              {subitem.title === "Niveau de français" &&
                (subitem.niveaux || []).length > 0 && (
                  <FrenchCECRLevel subitem={subitem} />
                )}
              {subitem.title === "Zone d'action" &&
                (subitem.departments || []).length > 0 && (
                  <DepartmentsSelected
                    subitem={subitem}
                    disableEdit={disableEdit}
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
              <CardFooter>{cardFooterContent(subitem)}</CardFooter>
            }
            {
              // deletion of an infocard in edit mode
              !this.props.disableEdit && (
                <div className="card-icons">
                  <div
                    onClick={() =>
                      this.props.deleteCard(this.props.keyValue, subkey)
                    }
                  >
                    <EVAIcon
                      size="xlarge"
                      name="close-circle"
                      fill={colors.noirCD}
                      className="delete-icon"
                    />
                  </div>
                </div>
              )
            }
          </Card>
        </Col>
        {
          <FrenchLevelModal
            show={this.state.showFrenchLevelModal}
            disableEdit={this.props.disableEdit}
            hideModal={() => this.toggleFrenchLevelModal(false)}
            selectedLevels={subitem.niveaux}
            validateLevels={this.validateLevels}
            t={this.props.t}
          />
        }
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

interface PlusCardProps {
  addItem: (arg1: number, arg2: string, arg3?: string | null) => void;
  keyValue: number;
  cards: string[];
}

const PlusCard = (props: PlusCardProps) => {
  const availableCardTitles = cardTitles.filter(
    (x) => !props.cards.includes(x.title)
  );
  const nextTitle =
    availableCardTitles.length > 0 ? availableCardTitles[0].title : "";
  return (
    <Col xl="4" lg="6" md="6" sm="12" xs="12" className="card-col">
      <Card
        className="add-card"
        onClick={() => props.addItem(props.keyValue, "card", nextTitle)}
      >
        <CardHeader className="backgroundColor-darkColor">
          Ajouter un item
        </CardHeader>
        <CardBody>
          <span className="add-sign">+</span>
        </CardBody>
      </Card>
    </Col>
  );
};

export { PlusCard };
