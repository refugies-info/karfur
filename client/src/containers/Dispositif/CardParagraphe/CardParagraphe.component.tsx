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

import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import FSwitch from "../../../components/FigmaUI/FSwitch/FSwitch";

import "./CardParagraphe.scss";
// @ts-ignore
import variables from "scss/colors.scss";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { Props } from "./CardParagraphe.container";
import { DispositifContent, Tag } from "../../../@types/interface";
import { filtres, cardTitles } from "../data";
import _ from "lodash";
import { infoCardIcon } from "../../../components/Icon/Icon";
import { FrenchLevelModal } from "../FrenchLevelModal";

const niveaux = ["A1.1", "A1", "A2", "B1", "B2", "C1", "C2"];
const frequencesPay = [
  "une seule fois ",
  "à chaque fois",
  "par heure",
  "par semaine",
  "par mois",
  "par an",
];

// difficult to type
type Element = any;

interface Content {
  abstract: string;
  contact: string;
  externalLink: string;
  titreInformatif: string;
  titreMarque: string;
}

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
  toggleNiveau: (arg1: string, arg2: number, arg3: number) => void;
  deleteCard: (arg1: number, arg2: number) => void;
  content: Content;
  keyValue: number;
  t: any;
  cards: string[];
  mainTag: Tag;
}
type StateType = {
  isDropdownOpen: boolean;
  isOptionsOpen: boolean;
  showNiveaux: boolean;
  tooltipOpen: boolean;
  showFrenchLevelModal: boolean;
};

export class CardParagraphe extends Component<Props> {
  state: StateType = {
    isDropdownOpen: false,
    isOptionsOpen: false,
    showNiveaux: false,
    tooltipOpen: false,
    showFrenchLevelModal: false,
  };

  toggleNiveaux = () => this.setState({ showNiveaux: !this.state.showNiveaux });
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

  footerClicked = () => {
    if (this.props.subitem.footerHref) {
      // @ts-ignore
      window.open(this.props.subitem.footerHref, "_blank");
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
    const { showNiveaux } = this.state;
    const jsUcfirst = (string: string, title: string) => {
      if (title === "Public visé" && string && string.length > 1) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      return string;
    };

    // filter cards to have maximum one infocard by category
    const availableCardTitles = cardTitles.filter(
      (x) => !this.props.cards.includes(x.title)
    );

    const contentTitle = (subitem: DispositifContent) => {
      let cardTitle = cardTitles.find((x) => x.title === subitem.title);
      // edition mode of cards with options
      // for example Public visé, Age requis, Durée, Niveau de français
      if (
        cardTitle &&
        cardTitle.options &&
        cardTitle.options.length > 0 &&
        !disableEdit
      ) {
        if (
          !subitem.contentTitle ||
          !cardTitle.options.some(
            (x: string) =>
              // @ts-ignore : check if subitem.contentTitle is undefined already done
              x.toUpperCase() === subitem.contentTitle.toUpperCase()
          )
        ) {
          subitem.contentTitle = cardTitle.options[0];
          subitem.contentBody = "A modifier";
        }
        return (
          <ButtonDropdown
            isOpen={this.state.isOptionsOpen}
            toggle={this.toggleOptions}
            className="content-title"
          >
            <DropdownToggle caret={!disableEdit}>
              {subitem.title === "Âge requis" ? (
                // case Age Requis
                <span>
                  {subitem.contentTitle.split("**").map((x, i, arr) => (
                    <React.Fragment key={i}>
                      <span>{x}</span>
                      {i < arr.length - 1 && (
                        <Input
                          type="number"
                          className="color-darkColor age-input"
                          value={
                            (arr[0] === "De " && i === 0) ||
                            arr[0] === "Plus de "
                              ? subitem.bottomValue
                              : subitem.topValue
                          }
                          onClick={(e) => e.stopPropagation()}
                          onMouseUp={() =>
                            (this.props.subitem || {}).isFakeContent &&
                            this.props.changeAge(
                              { target: { value: "" } },
                              this.props.keyValue,
                              this.props.subkey,
                              i === 0 || arr[0] === "Plus de"
                            )
                          }
                          onChange={(e) =>
                            this.props.changeAge(
                              e,
                              this.props.keyValue,
                              this.props.subkey,
                              (arr[0] === "De " && i === 0) ||
                                arr[0] === "Plus de"
                            )
                          }
                        />
                      )}
                    </React.Fragment>
                  ))}
                </span>
              ) : (
                <span>
                  {subitem.contentTitle &&
                    jsUcfirst(
                      t(
                        "Dispositif." + subitem.contentTitle,
                        subitem.contentTitle
                      ),
                      cardTitle.title
                    )}
                </span>
              )}
            </DropdownToggle>
            <DropdownMenu>
              {cardTitle.options.map((option, key: number) => {
                return (
                  //@ts-ignore
                  <DropdownItem key={key} id={key}>
                    {cardTitle ? jsUcfirst(option, cardTitle.title) : ""}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </ButtonDropdown>
        );
        // case infocard Combien ça coute (lecture and edition)
      } else if (subitem.title === "Combien ça coûte ?") {
        return (
          <>
            {disableEdit ? (
              <div className="card-custom-title">
                {subitem.free
                  ? t("Dispositif.Gratuit", "Gratuit")
                  : t("Dispositif.Payant", "Payant")}
              </div>
            ) : (
              <FSwitch
                className="card-custom-title"
                precontent="Gratuit"
                content="Payant"
                checked={!subitem.free}
                onClick={() =>
                  this.props.toggleFree(this.props.keyValue, this.props.subkey)
                }
              />
            )}
            {!subitem.free && (
              <span className="color-darkColor price-details">
                {disableEdit ? (
                  <span>{subitem.price}</span>
                ) : (
                  <Input
                    type="number"
                    className="color-darkColor age-input"
                    disabled={disableEdit}
                    value={subitem.price}
                    onMouseUp={() =>
                      (this.props.subitem || {}).isFakeContent &&
                      this.props.changePrice(
                        { target: { value: "" } },
                        this.props.keyValue,
                        this.props.subkey
                      )
                    }
                    onChange={(e) =>
                      this.props.changePrice(
                        e,
                        this.props.keyValue,
                        this.props.subkey
                      )
                    }
                  />
                )}
                <span>€ </span>
                <ButtonDropdown
                  isOpen={!disableEdit && this.state.isOptionsOpen}
                  toggle={this.toggleOptions}
                  className="content-title price-frequency"
                >
                  <DropdownToggle caret={!disableEdit}>
                    <span>
                      {subitem.contentTitle &&
                        t(
                          "Dispositif." + subitem.contentTitle,
                          subitem.contentTitle
                        )}
                    </span>
                  </DropdownToggle>
                  <DropdownMenu>
                    {frequencesPay.map((f, key) => (
                      //@ts-ignore
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
      }

      let texte;
      if (subitem.title === "Âge requis") {
        texte =
          subitem.contentTitle === "De ** à ** ans"
            ? t("Dispositif.De", "De") +
              " " +
              subitem.bottomValue +
              " " +
              t("Dispositif.à", "à") +
              " " +
              subitem.topValue +
              " " +
              t("Dispositif.ans", "ans")
            : subitem.contentTitle === "Moins de ** ans"
            ? t("Dispositif.Moins de", "Moins de") +
              " " +
              subitem.topValue +
              " " +
              t("Dispositif.ans", "ans")
            : t("Dispositif.Plus de", "Plus de") +
              " " +
              subitem.bottomValue +
              " " +
              t("Dispositif.ans", "ans");
      } else if (subitem.title === "Combien ça coûte ?") {
        texte = subitem.free
          ? t("Dispositif.gratuit", "gratuit")
          : subitem.price +
            " € " +
            t("Dispositif." + subitem.contentTitle, subitem.contentTitle);
      } else if (cardTitle && cardTitle.options) {
        texte = jsUcfirst(
          t("Dispositif." + subitem.contentTitle, subitem.contentTitle),
          cardTitle.title
        );
      } else {
        texte = subitem.contentTitle;
      }

      // display infocards (except combien ça coute)
      // edition of infocards Important
      return (
        <ContentEditable
          //@ts-ignore
          id={this.props.keyValue}
          className="card-input"
          data-subkey={subkey}
          data-target="contentTitle"
          html={texte} // innerHTML of the editable div
          disabled={this.props.disableEdit} // use true to disable editing
          onChange={this.props.handleMenuChange} // handle innerHTML change
          onMouseUp={this.emptyPlaceholder}
        />
      );
    };

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
          ? "basic"
          : this.props.mainTag.short.replace(/ /g, "-");
      return (
        subitem.title.replace(/ /g, "-").replace("-?", "").replace("-!", "") +
        "-" +
        safeMainTag
      );
    };

    const cardFooterContent = (subitem: DispositifContent) => {
      // in lecture mode, display button with a link to evaluate french level in infocard Niveau de français
      if (this.props.subitem.footerHref && disableEdit) {
        return (
          <FButton
            type="light-action"
            name={subitem.footerIcon}
            onClick={this.footerClicked}
          >
            {subitem.footer &&
              t("Dispositif." + subitem.footer, subitem.footer)}
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
                {contentTitle(subitem)}
              </span>
              {subitem.title === "Niveau de français" &&
                (showNiveaux || (subitem.niveaux || []).length > 0 ? (
                  // info card Niveau de francais, selection of level in edit mode
                  <div className="niveaux-wrapper">
                    {niveaux.map((nv, key) => (
                      <button
                        key={key}
                        className={
                          (subitem.niveaux || []).some((x: string) => x === nv)
                            ? "active"
                            : ""
                        }
                        disabled={this.props.disableEdit}
                        onClick={() =>
                          this.props.toggleNiveau(
                            nv,
                            this.props.keyValue,
                            this.props.subkey
                          )
                        }
                      >
                        {nv}
                      </button>
                    ))}
                  </div>
                ) : (
                  // in edit mode, chose to precise the level of french
                  !this.props.disableEdit && (
                    <u
                      className="cursor-pointer"
                      onClick={() => this.toggleFrenchLevelModal(true)}
                    >
                      Préciser
                    </u>
                  )
                ))}
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
                      fill={variables.noirCD}
                      className="delete-icon"
                    />
                  </div>
                </div>
              )
            }
          </Card>
        </Col>
        <FrenchLevelModal
          show={this.state.showFrenchLevelModal}
          disableEdit={false}
          hideModal={() => this.toggleFrenchLevelModal(false)}
        />
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
