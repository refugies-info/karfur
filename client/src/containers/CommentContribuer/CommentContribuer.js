import React, { Component } from "react";
import track from "react-tracking";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Row, Col, Card, CardHeader, CardFooter, CardBody } from "reactstrap";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { connect } from "react-redux";
import Swal from "sweetalert2";

import API from "../../utils/API";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import SVGIcon from "../../components/UI/SVGIcon/SVGIcon";
import { image_corriger } from "../../assets/figma";
import { CheckDemarcheModal } from "../../components/Modals";

import variables from "scss/colors.scss";
import styled from "styled-components";
import HeaderBackgroungImage from "../../assets/comment-contribuer/CommentContribuer-header.svg";
import BackgroundDispositif from "../../assets/comment-contribuer/CommentContribuer-background_orange.svg";
import { ReactComponent as DispositifImage } from "../../assets/comment-contribuer/CommentContribuer-dispositif.svg";
import BackgroundDemarche from "../../assets/comment-contribuer/CommentContribuer-background_rouge.svg";
import { ReactComponent as DemarcheImage } from "../../assets/comment-contribuer/CommentContribuer-demarche.svg";
import BackgroundStructure from "../../assets/comment-contribuer/CommentContribuer-background_violet.svg";
import { ReactComponent as StructureImage } from "../../assets/comment-contribuer/CommentContribuer-structure.svg";
import BackgroundLexique from "../../assets/comment-contribuer/CommentContribuer-background_bleu.svg";
import { ReactComponent as LexiqueImage } from "../../assets/comment-contribuer/CommentContribuer-lexique.svg";

const MainContainer = styled.div`
  flex: 1;
`;
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${HeaderBackgroungImage});
  margin-top: -75px;
  width: 100%;
  height: 720px;
`;

const HeaderText = styled.div`
  font-weight: bold;
  font-size: 52px;
  line-height: 66px;
  color: #ffffff;
  margin-top: 191px;
  margin-bottom: 72px;
`;

const CardContainer = styled.div`
  width: 200px;
  height: 200px;
  background-color: #ffffff;
  border-radius: 12px;
  display: flex;
  flex-direction:column
  justify-content: space-between;
  padding-bottom: 20px;
  padding-right: 20px;
  padding-left: 20px;
  padding-top:10px;
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  cursor:pointer;
  border: 4px solid #ffffff;

&:hover {
  border: 4px solid #212121;
}
`;

const RedactionContainer = styled.div`
  padding-top: 48px;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  padding-left: 120px;
  padding-right: 120px;
  background: #ffffff;
  padding-bottom: 106px;
`;

const IconContainer = styled.div`
  align-self: flex-end;
  margin: 0px;
  padding: 0px;
`;

const RedactionCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 48px;
  justify-content: space-between;
`;

const HeaderCard = (props) => (
  <CardContainer>
    <IconContainer>
      {props.eva ? (
        <EVAIcon name={props.iconName} size="xlarge" fill="#212121" />
      ) : (
        <SVGIcon name="translate" fill="#212121" width="40px" height="40px" />
      )}
    </IconContainer>
    {props.title}
  </CardContainer>
);

const HeaderCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const DispoCardContainer = styled.div`
  background-image: url(${BackgroundDispositif});
  background-repeat: no-repeat;
  height: 480px;
  width: 283px;
  border-radius: 12px;
  padding: 24px;
  padding-bottom: 12px;
  border: 4px solid #ffffff;
  cursor: pointer;
  &:hover {
    border: 4px solid #f9aa75;
  }
  position: relative;
`;

const DemarcheCardContainer = styled.div`
  background-image: url(${BackgroundDemarche});
  background-repeat: no-repeat;
  height: 480px;
  width: 283px;
  border-radius: 12px;
  padding: 24px;
  padding-bottom: 12px;

  border: 4px solid #ffffff;
  cursor: pointer;
  &:hover {
    border: 4px solid #de6b8a;
  }
  position: relative;
`;

const StructureCardContainer = styled.div`
  background-image: url(${BackgroundStructure});
  background-repeat: no-repeat;
  height: 480px;
  width: 283px;
  border-radius: 12px;
  padding: 24px;
  padding-bottom: 12px;

  border: 4px solid #ffffff;
  cursor: not-allowed;
  position: relative;
`;

const LexiqueCardContainer = styled.div`
  background-image: url(${BackgroundLexique});
  background-repeat: no-repeat;
  height: 480px;
  width: 283px;
  border-radius: 12px;
  padding: 24px;
  padding-bottom: 12px;

  border: 4px solid #ffffff;
  cursor: not-allowed;
  position: relative;
`;

const TitleContainer = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 16px;
`;

const TitleFramed = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: #fbfbfb;
  background: #212121;
  padding: 4px 8px;
  width: ${(props) => props.width};
  margin-top: 4px;
`;
const DescriptionText = styled.div`
  font-size: 18px;
  line-height: 23px;
  margin-top: 16px;
`;

const TimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  position: absolute;
  bottom: 12px;
`;

const DispositifCard = (props) => (
  <DispoCardContainer>
    <DispositifImage />
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <TitleContainer>
          {props.t("CommentContribuer.Rédiger une fiche", "Rédiger une fiche")}
        </TitleContainer>
        <TitleFramed width={"113px"}>
          {props.t("CommentContribuer.Dispositif", "Dispositif")}
        </TitleFramed>
        <DescriptionText>
          {props.t(
            "CommentContribuer.DispositifDescription",
            `Programme, atelier, formation, cours en ligne, permanence d’accueil ou
      tout autre dispositif directement accessible par les personnes réfugiées.`
          )}
        </DescriptionText>
      </div>
      <TimeContainer>
        <EVAIcon
          name="clock-outline"
          fill="#000000"
          size="10"
          className="mr-10"
        />
        {"~ 20 "}
        {props.t("CommentContribuer.minutes", "minutes")}
      </TimeContainer>
    </div>
  </DispoCardContainer>
);

const StructureCard = (props) => (
  <StructureCardContainer>
    <StructureImage />
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <TitleContainer>
          {props.t("CommentContribuer.Recenser", "Recenser une")}
        </TitleContainer>
        <TitleFramed width={"148px"}>
          {props.t("CommentContribuer.Organisation", "Organisation")}
        </TitleFramed>
        <DescriptionText>
          {props.t(
            "CommentContribuer.StructureDescription",
            "Complétez l’annuaire de l’intégration pour faciliter la prise de contact entre acteurs et l’accès aux interlocuteurs pour les personnes réfugiées."
          )}
        </DescriptionText>
      </div>
      <TimeContainer>
        <EVAIcon
          name="sun-outline"
          fill="#000000"
          size="10"
          className="mr-10"
        />
        {props.t("CommentContribuer.Bientôt disponible", "Bientôt disponible")}
      </TimeContainer>
    </div>
  </StructureCardContainer>
);

const DemarcheCard = (props) => (
  <DemarcheCardContainer>
    <DemarcheImage />
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <TitleContainer>
          {props.t("CommentContribuer.Rédiger une fiche", "Rédiger une fiche")}
        </TitleContainer>
        <TitleFramed width={"122px"}>
          {props.t("CommentContribuer.Démarche", "Démarche")}
        </TitleFramed>
        <DescriptionText>
          {props.t(
            "CommentContribuer.DemarcheDescription",
            "Expliquez une démarche administrative étape par étape pour faciliter son accès et sa compréhension par les personnes réfugiées."
          )}
        </DescriptionText>
      </div>
      <TimeContainer>
        <EVAIcon
          name="clock-outline"
          fill="#000000"
          size="10"
          className="mr-10"
        />
        {"~ 40 "}
        {props.t("CommentContribuer.minutes", "minutes")}
      </TimeContainer>
    </div>
  </DemarcheCardContainer>
);

const LexiqueCard = (props) => (
  <LexiqueCardContainer>
    <LexiqueImage />
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <TitleContainer>
          {props.t("CommentContribuer.Ajouter un mot au", "Ajouter un mot au")}
        </TitleContainer>
        <TitleFramed width={"97px"}>
          {props.t("CommentContribuer.Lexique", "Lexique")}
        </TitleFramed>
        <DescriptionText>
          {props.t(
            "CommentContribuer.LexiqueDescription",
            "Expliquez les mots difficiles de l’administration et de l’intégration pour faciliter la compréhension pour les personnes réfugiées."
          )}
        </DescriptionText>
      </div>

      <TimeContainer>
        <EVAIcon
          name="calendar-outline"
          fill="#000000"
          size="10"
          className="mr-10"
        />
        {props.t("CommentContribuer.Prochainement", "Prochainement")}
      </TimeContainer>
    </div>
  </LexiqueCardContainer>
);

class CommentContribuer extends Component {
  state = {
    showModals: { checkDemarche: false },
    users: [],
  };
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    API.get_users({
      query: { status: "Actif" },
      populate: "roles",
    }).then((data) =>
      this.setState({ users: this._isMounted && data.data.data })
    );
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  toggleModal = (show, name) =>
    this.setState((prevState) => ({
      showModals: { ...prevState.showModals, [name]: show },
    }));

  upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore disponible",
      type: "error",
      timer: 1500,
    });

  render() {
    const { t, langues } = this.props;
    const { showModals, users } = this.state;
    return (
      <MainContainer>
        <HeaderContainer>
          <HeaderText>
            {t("CommentContribuer.Comment contribuer", "Comment contribuer ?")}
          </HeaderText>
          <HeaderCardsContainer>
            <div style={{ marginRight: "48px" }}>
              <AnchorLink offset="60" href="#ecrire">
                <HeaderCard title="écrire" iconName="edit-outline" eva={true} />
              </AnchorLink>
            </div>
            <div style={{ marginRight: "48px" }}>
              <HeaderCard title="traduire" iconName="edit-outline" />
            </div>
            <HeaderCard
              title="corriger"
              iconName="done-all-outline"
              eva={true}
            />
          </HeaderCardsContainer>
        </HeaderContainer>
        <RedactionContainer id="ecrire">
          {t("CommentContribuer.Redaction", "Rédiger de nouveaux contenus")}
          <RedactionCardsContainer>
            <NavLink to="/dispositif" className="no-decoration">
              <DispositifCard t={t} />
            </NavLink>
            <NavLink to="/demarche" className="no-decoration">
              <DemarcheCard t={t} />
            </NavLink>

            <StructureCard t={t} />
            <LexiqueCard t={t} />
          </RedactionCardsContainer>
        </RedactionContainer>
        {/* <section id="ecrire">
          <div className="section-container">
            <div className="section-header">
              <h2>{t("CommentContribuer.Écrire", "Écrire")}</h2>
              <h5>
                {t(
                  "CommentContribuer.Partageons l-information",
                  "Partageons l’information !"
                )}
              </h5>
            </div>

            <Row className="cards-row">
              <Col xl="3" lg="3" md="6" sm="12" xs="12" className="card-col">
                <NavLink to="/dispositif" className="no-decoration">
                  <Card className="dispositif-card">
                    <CardHeader>
                      {t(
                        "CommentContribuer.Ajouter un dispositif",
                        "Ajouter un dispositif d'accompagnement"
                      )}
                    </CardHeader>
                    <CardBody>
                      {t(
                        "CommentContribuer.Ajouter dispositif cardbody",
                        "Rédigez la fiche pratique d'un dispositif d'accompagnement pour que les personnes réfugiées soient pleinement informées et puissent s'y engager."
                      )}
                    </CardBody>
                    <CardFooter>
                      <EVAIcon name="clock-outline" className="clock-icon" />
                      <span className="float-right">
                        ~ 20 {t("minutes", "minutes")}
                      </span>
                    </CardFooter>
                  </Card>
                </NavLink>
              </Col>
              <Col xl="3" lg="3" md="6" sm="12" xs="12" className="card-col">
                <Card
                  className="cursor-pointer demarche-card"
                  onClick={() => this.toggleModal(true, "checkDemarche")}
                >
                  <CardHeader>
                    {t(
                      "CommentContribuer.Expliquer une démarche administrative",
                      "Expliquer une démarche administrative"
                    )}
                  </CardHeader>
                  <CardBody>
                    {t(
                      "CommentContribuer.Expliquer démarche cardbody",
                      "Rédigez la fiche pratique d'une démarche administrative qui détaille, étape par étape, les actions à mener pour la réussir."
                    )}
                  </CardBody>
                  <CardFooter>
                    <EVAIcon name="clock-outline" className="clock-icon" />
                    <span>~ 20 {t("minutes", "minutes")}</span>
                  </CardFooter>
                </Card>
              </Col>
              <Col xl="3" lg="3" md="6" sm="12" xs="12" className="card-col">
                <Card className="cursor-pointer" onClick={this.upcoming}>
                  <CardHeader>
                    {t(
                      "CommentContribuer.Ajouter une définition",
                      "Ajouter une définition"
                    )}
                  </CardHeader>
                  <CardBody>
                    {t(
                      "CommentContribuer.Ajouter définition cardbody",
                      "Enrichissez le lexique collaboratif pour que tout le monde comprenne mieux les mots de l’intégration."
                    )}
                  </CardBody>
                  <CardFooter>
                    <span>{t("Bientôt disponible", "Bientôt disponible")}</span>
                  </CardFooter>
                </Card>
              </Col>
              <Col xl="3" lg="3" md="6" sm="12" xs="12" className="card-col">
                <Card className="cursor-pointer" onClick={this.upcoming}>
                  <CardHeader>
                    {t(
                      "CommentContribuer.Créer un parcours",
                      "Créer un parcours"
                    )}
                  </CardHeader>
                  <CardBody>
                    {t(
                      "CommentContribuer.Créer parcours cardbody",
                      "Vous avez un objectif ? On vous liste les étapes à franchir pour l’atteindre dans notre moteur de parcours d’intégration."
                    )}
                  </CardBody>
                  <CardFooter>
                    <span>{t("Bientôt disponible", "Bientôt disponible")}</span>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        <section id="traduire">
          <div className="section-container">
            <div className="section-header">
              <h2>{t("CommentContribuer.Traduire", "Traduire")}</h2>
              <h5>
                {t(
                  "CommentContribuer.Rendons l-information accessible",
                  "Rendons l’information accessible à tous !"
                )}
              </h5>
            </div>

            <div className="trad-layout">
              <div className="left-side">
                <h5>
                  {t(
                    "CommentContribuer.Autre langue",
                    "Vous parlez une autre langue ? Rejoignez-nous !"
                  )}
                </h5>
                <div className="data">
                  <div className="left-data">
                    <h3>
                      {
                        (
                          users.filter((x) =>
                            (x.roles || []).some((y) => y.nom === "Trad")
                          ) || []
                        ).length
                      }
                    </h3>
                  </div>
                  <h5 className="right-data">
                    {t(
                      "CommentContribuer.traducteurs actifs",
                      "traducteurs actifs"
                    )}
                  </h5>
                </div>
                <div className="data">
                  <div className="left-data">
                    <h3>
                      {
                        (
                          users.filter((x) =>
                            (x.roles || []).some((y) => y.nom === "ExpertTrad")
                          ) || []
                        ).length
                      }
                    </h3>
                  </div>
                  <h5 className="right-data">
                    {t(
                      "CommentContribuer.experts en traduction",
                      "experts en traduction"
                    )}
                  </h5>
                </div>
              </div>
              <div className="right-side">
                <Row className="langues-wrapper">
                  {langues.map((langue) => (
                    <Col
                      xl="4"
                      lg="4"
                      md="4"
                      sm="4"
                      xs="4"
                      className="langue-col"
                      key={langue._id}
                    >
                      {langue.avancement ? (
                        <NavLink to="/backend/user-dashboard">
                          <div className="langue-item-available">
                            <h5>
                              <i
                                className={
                                  "mr-20 flag-icon flag-icon-" +
                                  langue.langueCode
                                }
                                title={langue.langueCode}
                              />
                              {langue.langueFr}

                              <span className={"float-right color-vert"}>
                                {Math.round(langue.avancement * 100, 0) + " %"}
                              </span>
                            </h5>
                          </div>
                        </NavLink>
                      ) : (
                        <div className="langue-item-non-available">
                          <h5>
                            <i
                              className={
                                "mr-20 flag-icon flag-icon-" + langue.langueCode
                              }
                              title={langue.langueCode}
                            />
                            {langue.langueFr}

                            <span className={"float-right text-soon"}>
                              Prochainement
                            </span>
                          </h5>
                        </div>
                      )}
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        </section>

        <section id="corriger">
          <div className="section-container">
            <div className="section-header">
              <h2>{t("CommentContribuer.Corriger", "Corriger")}</h2>
              <h5>
                {t(
                  "CommentContribuer.information juste",
                  "Maintenons une information juste et à jour !"
                )}
              </h5>
            </div>

            <div className="correct-layout">
              <div className="left-side">
                <Row>
                  <Col xl="2" lg="2" md="2" sm="2" xs="2">
                    <div className="toolbar-icon-wrapper">
                      <EVAIcon
                        name="message-circle-outline"
                        fill={variables.noir}
                      />
                    </div>
                  </Col>
                  <Col xl="10" lg="10" md="10" sm="10" xs="10">
                    <div className="texte-normal">
                      <b>
                        {t(
                          "CommentContribuer.Commentaire ciblé",
                          "Commentaire ciblé"
                        )}
                      </b>
                    </div>
                    <span className="texte-gris">
                      {t(
                        "CommentContribuer.paragraphe erroné",
                        "Un paragraphe est erroné ? Dites-le-nous !"
                      )}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col xl="2" lg="2" md="2" sm="2" xs="2">
                    <div className="toolbar-icon-wrapper">
                      <EVAIcon name="volume-up-outline" fill={variables.noir} />
                    </div>
                  </Col>
                  <Col xl="10" lg="10" md="10" sm="10" xs="10">
                    <div className="texte-normal">
                      <b>
                        {t(
                          "CommentContribuer.Écoute du texte",
                          "Écoute du texte"
                        )}
                      </b>
                    </div>
                    <span className="texte-gris">
                      {t(
                        "CommentContribuer.Écoutez ou faites écouter",
                        "Écoutez ou faites écouter les informations écrites de la plateforme"
                      )}
                    </span>
                  </Col>
                </Row>
              </div>
              <div className="right-side">
                <img
                  src={image_corriger}
                  className="image_corriger"
                  alt="corriger"
                />
              </div>
            </div>
          </div>
        </section>

        <CheckDemarcheModal
          show={showModals.checkDemarche}
          toggle={() => this.toggleModal(false, "checkDemarche")}
          upcoming={this.upcoming}
        /> */}
      </MainContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    langues: state.langue.langues,
  };
};

export default track({
  page: "CommentContribuer",
})(connect(mapStateToProps)(withTranslation()(CommentContribuer)));
