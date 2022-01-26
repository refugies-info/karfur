import React, { Component } from "react";
import { Card, CardBody, Row, Col, Tooltip, Button } from "reactstrap";
import h2p from "html2plaintext";
import { Props } from "./QuickToolbar.container";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import styles from "./QuickToolbar.module.scss";

interface StateType {
  fill: boolean[];
  tooltipOpen: boolean[];
  isDropdownOpen: boolean;
  dropdownColor: string[];
  isVoiceActiv: boolean;
}

export interface PropsBeforeInjection {
  disableEdit: boolean;
  toggleModal: (arg1: boolean, arg2: string) => void;
  readAudio: (arg1: any, arg2: string, arg3: any, arg4: boolean) => void;
  stopAudio: () => void;
  item: any;
  subkey: number;
  handleContentClick: (arg1: any, arg2: boolean, arg3: number) => void;
  keyValue: any;
  show: boolean;
  removeItem: (arg1: number, arg2: number) => void;
  t: any;
  ttsActive: boolean;
}

export class QuickToolbar extends Component<Props, StateType> {
  state: StateType = {
    fill: new Array(4).fill(false),
    tooltipOpen: new Array(4).fill(false),
    isDropdownOpen: false,
    dropdownColor: new Array(4).fill("#FFFFFF"),
    isVoiceActiv: false,
  };

  _hoverOn = (key: number) =>
    this.setState((prevState: StateType) => ({
      fill: prevState.fill.map((_, i) => key === i),
    }));
  _hoverOff = () =>
    this.setState((prevState: StateType) => ({
      fill: prevState.fill.map(() => false),
    }));
  toggleTooltip = (key: number) => {
    this.setState((prevState: StateType) => ({
      tooltipOpen: prevState.tooltipOpen.map((x, i) =>
        key === i ? !x : false
      ),
    }));
  };
  toggle = () => this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  toggleColor = (key: number, hover: string) =>
    this.setState((prevState: StateType) => ({
      dropdownColor: prevState.dropdownColor.map((_, i) =>
        i === key ? (hover ? "#3D3D3D" : "#FFFFFF") : "#FFFFFF"
      ),
    }));

  getSectionTitleInCorrectLanguage = (title: string) => {
    if (
      [
        "C'est quoi ?",
        "C'est pour qui ?",
        "Pourquoi c'est intéressant ?",
        "Comment je m'engage ?",
        "La démarche par étapes",
        "Comment faire ?",
        "Et après ?",
      ].includes(title)
    ) {
      return this.props.t(`Dispositif.${title}`);
    }

    return title;
  };

  _onClick = (id: number) => {
    if (this.props.disableEdit) {
      if (id === 0) {
        this.props.toggleModal(true, "reaction");
      } else if (id === 1 && !this.state.isVoiceActiv) {
        let node = this.props.item;
        if (
          this.props.subkey !== undefined &&
          this.props.subkey !== null &&
          this.props.subkey >= 0 &&
          node.children &&
          node.children.length > 0
        ) {
          node = this.props.item.children[this.props.subkey];
        }
        this.setState({ isVoiceActiv: !this.state.isVoiceActiv });
        node &&
          node.title &&
          this.props.readAudio(
            h2p(this.getSectionTitleInCorrectLanguage(node.title)),
            this.props.activeLangue,
            () =>
              this.props.readAudio(
                h2p(node.content),
                this.props.activeLangue,
                () =>
                  this.props.readAudio(
                    "",
                    this.props.activeLangue,
                    this.setState({ isVoiceActiv: !this.state.isVoiceActiv }),
                    true
                  ),
                true
              ),
            true
          );
      } else if (id === 1 && this.state.isVoiceActiv) {
        this.setState({ isVoiceActiv: !this.state.isVoiceActiv });
        this.props.stopAudio();
      }
    } else {
      if (id === 0) {
        this.props.handleContentClick(
          this.props.keyValue,
          true,
          this.props.subkey
        );
      } else if (id === 2) {
        this.props.removeItem(this.props.keyValue, this.props.subkey);
      }
    }
  };

  render() {
    const { t, show, disableEdit } = this.props;
    const showLanguageButton = ["fr", "en", "ar", "ru"].includes(
      this.props.activeLangue
    );
    if (show) {
      if (disableEdit) {
        return (
          <Card className={styles.toolbar}>
            <CardBody className={styles.card_body}>
              <Row>
                <Col lg="6" md="6" sm="12" xs="12" className={styles.col}>
                  <Button
                    className={[styles.btn_pill, styles.unactive].join(" ")}
                    id="eva-icon-0"
                    onMouseEnter={() => this._hoverOn(0)}
                    onMouseLeave={this._hoverOff}
                    onClick={() => this._onClick(0)}
                  >
                    <EVAIcon
                      name={
                        "message-circle" +
                        (this.state.fill[0] ? "" : "-outline")
                      }
                      fill={colors.darkColor}
                    />
                    <Tooltip
                      className={styles.tooltip_dark_back}
                      placement="top"
                      isOpen={this.state.tooltipOpen[0]}
                      target="eva-icon-0"
                      toggle={() => this.toggleTooltip(0)}
                    >
                      {t("Dispositif.réagir", "réagir")}
                    </Tooltip>
                  </Button>
                </Col>
                {showLanguageButton && (
                  <Col md="6" xs="12" className={styles.col}>
                    <Button
                      className={[
                        styles.btn_pill,
                        (this.state.isVoiceActiv ? styles.active : styles.unactive)
                      ].join(" ")}
                      id="eva-icon-1"
                      onMouseEnter={() => this._hoverOn(1)}
                      onMouseLeave={this._hoverOff}
                      onClick={() => this._onClick(1)}
                    >
                      <EVAIcon
                        name={
                          "volume-up" +
                          (this.state.fill[1] || this.props.ttsActive ? "" : "-outline")
                        }
                        fill={
                          this.state.isVoiceActiv
                            ? colors.blanc
                            : colors.darkColor
                        }
                      />

                      <Tooltip
                        className={styles.tooltip_dark_back}
                        placement="top"
                        isOpen={this.state.tooltipOpen[1]}
                        target="eva-icon-1"
                        toggle={() => this.toggleTooltip(1)}
                      >
                        {t("Dispositif.écouter", "écouter")}
                      </Tooltip>
                    </Button>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>
        );
      }
      return false;
    }
    return null;
  }
}
