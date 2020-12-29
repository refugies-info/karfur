import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap";
import ContentEditable from "react-contenteditable";
import ReactHtmlParser from "react-html-parser";
import { stringify } from "himalaya";
import ms from "pretty-ms";
import { NavLink } from "react-router-dom";
import DirectionProvider, {
  DIRECTIONS,
} from "react-with-direction/dist/DirectionProvider";
import _ from "lodash";
import "rc-slider/assets/index.css";

import API from "../../../utils/API";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import marioProfile from "../../../assets/mario-profile.jpg";

import "./StringTranslation.scss";
import {colors} from "colors";

export class StringTranslation extends Component {
  state = {
    tooltipOpen: false,
  };

  componentDidMount() {
    if (this.props.itemId) {
      this._initializeComponent(this.props);
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (nextProps.itemId !== this.props.itemId) {
      this._initializeComponent(nextProps);
      window.scrollTo(0, 0);
    }
  }

  _initializeComponent = async (props) => {
    const { itemId, locale, isExpert } = props;
    if (itemId && locale && !isExpert) {
      this._getArticle(itemId);
    } else if (itemId && isExpert) {
      API.get_tradForReview({
        query: { _id: itemId },
        populate: "userId",
      }).then((data_res) => {
        if (
          data_res.data.data.constructor === Array &&
          data_res.data.data.length > 0
        ) {
          const traduction = data_res.data.data[0];
          this._getArticle(traduction.jsonId || traduction.articleId, isExpert);
          this.props.fwdSetState({
            translated: {
              title: traduction.translatedText.title,
              body: traduction.jsonId
                ? traduction.translatedText.body
                : (stringify(traduction.translatedText.body) || "").replace(
                    / id='initial_/g,
                    " id='target_"
                  ), //Ici il y avait id=\'initial_/ avant
            },
            jsonId: traduction.jsonId,
            translationId: itemId,
            locale: traduction.langueCible,
            isExpert: isExpert,
            traducteur: traduction.userId,
            score: _.get(traduction, "translatedText.scoreBody.cosine.0.0", -1),
          });
        }
      });
    }
    // eslint-disable-next-line
    if (!itemId || !locale) {
    } else if (!isExpert) {
      this.setState({
        itemId: itemId,
        locale: locale,
      });
    }
  };

  _getArticle = (itemId) => {
    API.get_article({ _id: itemId }).then((data_res) => {
      if (
        data_res.data.data.constructor === Array &&
        data_res.data.data.length > 0
      ) {
        let article = data_res.data.data[0];
        this.setArticle(article);
      }
    });
  };

  setArticle = (article) => {
    const { itemId, locale, isExpert, langueBackupId } = this.props;
    this.props.fwdSetState(
      {
        francais: {
          title: article.title,
          body: article.isStructure ? article.body : stringify(article.body),
        },
        isStructure: article.isStructure,
        path: article.path,
        id: article.articleId,
        jsonBody: article.body,
        ...(article.avancement &&
          article.avancement[locale] && {
            avancement: article.avancement[locale],
          }),
      },
      () => {
        if (!isExpert) {
          //Je vérifie d'abord s'il n'y a pas eu une première traduction effectuée par un utilisateur :
          API.get_tradForReview({
            query: { jsonId: itemId, langueCible: locale },
            sort: "-avancement",
          }).then((data) => {
            if (data.data.data && data.data.data.length > 0) {
              let traductionFaite = data.data.data[0];
              this.props.fwdSetState({
                translated: {
                  title: traductionFaite.translatedText.title,
                  body: article.isStructure
                    ? traductionFaite.translatedText.body
                    : stringify(traductionFaite.translatedText.body),
                },
              });
            } else {
              //Je rend chaque noeud unique:
              this.props.translate(
                this.initial_text.innerHTML,
                langueBackupId || locale,
                "body"
              );
              // if(!this.props.isStructure){this.props.translate(this.initial_title.innerHTML, locale, 'title')}
            }
            this.props.fwdSetState({
              texte_a_traduire: this.initial_text.innerText,
            });
          });
        }
      }
    );
  };

  toggleTooltip = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  };

  reject_translation = () => {
    const newTrad = { _id: this.props.itemId, status: "Rejetée" };
    API.update_tradForReview(newTrad).then(() => this.props.onSkip());
  };

  render() {
    const {
      langue,
      francais,
      isStructure,
      score,
      translated,
      isExpert,
      time,
      nbMotsRestants,
      autosuggest,
      traducteur,
    } = this.props;
    const isRTL = ["ar", "ps", "fa"].includes(langue.i18nCode);

    return (
      <div className="animated fadeIn traduction">
        <div className="animated fadeIn traduction-container">
          <h2>Traduction des éléments du site</h2>
          <Row className="translation-row">
            <Col>
              <Card id="card_texte_initial">
                <CardHeader>
                  <i
                    className={"flag-icon flag-icon-fr"}
                    title="fr"
                    id="fr"
                  ></i>
                  <strong>Français</strong>
                  {/* <div className="card-header-actions pointer" onClick={this.upcoming}>
                    <span className="text-muted">Voir en contexte</span>{' '} 
                    <Icon name="eye-outline" fill="#3D3D3D" />
                  </div> */}
                </CardHeader>
                <CardBody>
                  {!isStructure && (
                    <div className="titre text-center">
                      <h1
                        id="title_texte_initial"
                        ref={this.props.innerRef}
                        // ref={initial_title => { this.props.setRef(initial_title, "initial_title") }}
                        onClick={(e) =>
                          this.props.handleClickText(e, "initial", "target")
                        }
                      >
                        {ReactHtmlParser(francais.title)}
                      </h1>
                    </div>
                  )}
                  <div
                    id="body_texte_initial"
                    ref={(initial_text) => {
                      this.initial_text = initial_text;
                    }}
                    onClick={(e) =>
                      this.props.handleClickText(e, "initial", "target")
                    }
                  >
                    {ReactHtmlParser(francais.body)}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card id="card_texte_final">
                {/* style={{height : 'calc(' + this.state.height + 'px - .8rem)'}} */}
                <CardHeader>
                  <span>
                    {isExpert ? (
                      <>
                        La traduction de{" "}
                        <img
                          src={
                            traducteur.picture && traducteur.picture.secure_url
                              ? traducteur.picture.secure_url
                              : marioProfile
                          }
                          className="profile-img-pin img-circle small-img"
                          alt="user profile"
                        />{" "}
                        <i>{traducteur.username}</i> en{" "}
                      </>
                    ) : (
                      "Votre traduction en "
                    )}
                  </span>
                  <i
                    className={"flag-icon flag-icon-" + langue.langueCode}
                    title={langue.langueCode}
                    id={langue.langueCode}
                  ></i>
                  <strong>{langue.langueFr}</strong>
                  {score !== -1 && (
                    <span className="float-right">
                      Score : <b>{(score * 100).toFixed(2)}</b> %
                    </span>
                  )}
                  {autosuggest && (
                    <div
                      className="card-header-actions pointer"
                      onClick={this.upcoming}
                    >
                      <span className="text-muted">Suggestion automatique</span>
                    </div>
                  )}
                </CardHeader>
                <CardBody>
                  {!isStructure && (
                    <div className="titre text-center">
                      <ConditionalSpinner show={!translated.title} />
                      <ContentEditable
                        id="title_texte_final"
                        className="title"
                        html={"<h1>" + translated.title + "</h1>"}
                        disabled={isExpert}
                        onChange={this.props.handleChange}
                      />
                    </div>
                  )}
                  <div
                    id="body_texte_final"
                    onClick={(e) =>
                      this.props.handleClickText(e, "target", "initial")
                    }
                  >
                    <ConditionalSpinner show={!translated.body} />
                    <DirectionProvider
                      direction={isRTL ? DIRECTIONS.RTL : DIRECTIONS.LTR}
                    >
                      <ContentEditable
                        key="target-editor-body"
                        className="body"
                        placeholder="Renseignez votre traduction ici"
                        html={translated.body || ""} // innerHTML of the editable div
                        disabled={false} // isExpert
                        onChange={this.props.handleChange} // handle innerHTML change
                        onSelect={this.onSelect}
                        style={{ textAlign: isRTL ? "right" : "left" }}
                      />
                    </DirectionProvider>
                    {/* <h3>Source</h3>
                    <textarea
                      className="form-control body"
                      value={translated.body}
                      onChange={this.handleChange}
                      onSelect={this.onSelect}
                    /> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="trad-footer">
            <Col lg="auto" className="left-col">
              <EVAIcon
                name="clock"
                fill={colors.grisFonce}
                className="mr-10"
              />
              <span className="timer">{ms(time)} passées</span>
              <EVAIcon
                name="hash"
                fill={colors.grisFonce}
                className="mr-10"
              />
              <span className="words">
                {nbMotsRestants} mot{nbMotsRestants > 1 && "s"} restant
                {nbMotsRestants > 1 && "s"}
              </span>
            </Col>
            <Col className="right-col">
              <FButton
                tag={NavLink}
                to="/backend/user-dashboard"
                type="light-action"
                name="log-out"
                fill={colors.noir}
                className="mr-10"
              >
                Fin de la session
              </FButton>
              <FButton
                type="light-action"
                name="arrow-forward"
                onClick={this.props.onSkip}
                className="mr-10"
              >
                Passer
              </FButton>
              {isExpert && (
                <FButton
                  type="error"
                  name="close-outline"
                  onClick={this.reject_translation}
                  className="mr-10"
                >
                  Rejeter
                </FButton>
              )}
              <FButton
                type="validate"
                name="checkmark-outline"
                fill={colors.error}
                onClick={() => this.props.valider()}
              >
                {" "}
                {/* disabled={disableBtn} */}
                Valider
              </FButton>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const ConditionalSpinner = (props) => {
  if (props.show) {
    return (
      <div className="text-center">
        <Spinner color="success" className="fadeIn fadeOut" />
      </div>
    );
  }
  return false;
};

export default withTranslation()(
  React.forwardRef((props, ref) => (
    <StringTranslation innerRef={ref} {...props} />
  ))
);
