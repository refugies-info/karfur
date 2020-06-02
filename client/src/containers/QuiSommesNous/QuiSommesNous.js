import React, { Component } from "react";
import track from "react-tracking";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Row, Col, Card, CardHeader, CardBody, CardFooter } from "reactstrap";
import AnchorLink from "react-anchor-link-smooth-scroll";

import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import FButton from "../../components/FigmaUI/FButton/FButton";
import { equipe } from "../../assets/figma/index";
import { membres } from "./data";

import "./QuiSommesNous.scss";

class QuiSommesNous extends Component {
  state = {
    sideVisible: false,
    membre: {},
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  _onSelectMembre = (membre) =>
    this.setState({ sideVisible: true, membre: membre });
  _closeSide = () => this.setState({ sideVisible: false });

  render() {
    const { membre, sideVisible } = this.state;
    const { t } = this.props;
    return (
      <div className="animated fadeIn qui-sommes-nous texte-small">
        <section id="hero">
          <div className="hero-container">
            <h1>{t("QuiSommesNous.Qui sommes-nous", "Qui sommes-nous ?")}</h1>
            <h4>
              {t(
                "QuiSommesNous.subheader",
                "Réfugiés.info améliore le parcours d’intégration des bénéficiaires de la protection internationale en France"
              )}
            </h4>
          </div>
          <AnchorLink
            offset="60"
            href="#missions"
            className="header-anchor d-inline-flex justify-content-center align-items-center"
          >
            <div className="slide-animation">
              <span className="slide-background"></span>
              <EVAIcon
                className="slide-bottom"
                name="arrow-circle-down"
                size="hero"
              />
            </div>
          </AnchorLink>
        </section>

        <section id="missions">
          <div className="section-container">
            <h2>{t("QuiSommesNous.Missions", "Missions")}</h2>

            <Row className="card-row">
              <Col xl="4" lg="4" md="4" sm="12" xs="12" className="card-col">
                <Card>
                  <CardHeader>
                    {t(
                      "QuiSommesNous.Mission_3_header",
                      "Recenser les initiatives sur tout le territoire"
                    )}
                  </CardHeader>
                  <CardBody>
                    <span>
                      {t(
                        "QuiSommesNous.Mission_3_subheader",
                        "Des milliers de personnes s’engagent au quotidien en France pour accueillir et accompagner les personnes réfugiées. Leurs actions, humbles et ambitieuses, souffrent parfois d’un manque de visibilité et ne profitent pas au plus grand nombre. Agi’r souhaite recenser et rendre accessible ces milliers d’initative"
                      )}
                      .
                    </span>
                  </CardBody>
                  <CardFooter>
                    <FButton
                      tag={NavLink}
                      to="/advanced-search"
                      type="outline-black"
                    >
                      {t("Chercher un dispositif", "Explorer les dispositifs")}
                    </FButton>
                  </CardFooter>
                </Card>
              </Col>
              <Col xl="4" lg="4" md="4" sm="12" xs="12" className="card-col">
                <Card>
                  <CardHeader>
                    {t(
                      "QuiSommesNous.Mission_2_header",
                      "Vulgariser et traduire les démarches administratives"
                    )}
                  </CardHeader>
                  <CardBody>
                    <span>
                      {t(
                        "QuiSommesNous.Mission_2_subheader",
                        "Dès la protection obtenue, les personnes réfugiées entre dans le droit commun et bénéficie des mêmes droits sociaux que tous les français. Cette situation engendre de nombreuses démarches administratives. Agi’r produit des fiches pratiques pour vulgariser ces démarches et les propose dans plus de 10 langues"
                      )}
                      .
                    </span>
                  </CardBody>
                  <CardFooter>
                    <FButton
                      tag={NavLink}
                      to="/advanced-search"
                      type="outline-black"
                    >
                      {t("Chercher une démarche", "Explorer les démarches")}
                    </FButton>
                  </CardFooter>
                </Card>
              </Col>
              <Col xl="4" lg="4" md="4" sm="12" xs="12" className="card-col">
                <Card>
                  <CardHeader>
                    {t(
                      "QuiSommesNous.Mission_1_header",
                      "Créer des parcours personnalisés d’intégration"
                    )}
                  </CardHeader>
                  <CardBody>
                    <span>
                      {t(
                        "QuiSommesNous.Mission_1_subheader",
                        "Obtenir l’asile, c’est surtout reconstruire. Un chez soi, un réseau, une vocation. Le déracinement a souvent brouillé les repères, les ambitions, les objectifs. Agi’r propose un outil structurant l’action et permettant aux réfugiés d’atteindre plus vite et plus sereinement ses objectifs de vie"
                      )}
                      .
                    </span>
                  </CardBody>
                  <CardFooter>
                    <span>{t("Bientôt disponible", "Bientôt disponible")}</span>
                    {/*<FButton type="outline-black">
                      Créer mon parcours
                    </FButton>*/}
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        <section id="equipe">
          <div className="section-container">
            <h2>{t("QuiSommesNous.Équipe", "Équipe")}</h2>
            <Row className="membres-row">
              {membres.map((membre, key) => (
                <Col
                  className="cursor-pointer"
                  key={key}
                  onClick={() => this._onSelectMembre(membre)}
                >
                  {membre.firstName}
                </Col>
              ))}
            </Row>
          </div>
          <div className="team-wrapper">
            <img
              className="team-picture"
              src={equipe}
              onClick={this._closeSide}
              alt="équipe"
            />
            {sideVisible && (
              <div className="description">
                <div className="team-header">
                  <h3>{membre.name}</h3>
                  <span>
                    {membre.statut &&
                      t(
                        "QuiSommesNous.statut-" + membre.firstName,
                        membre.statut
                      )}
                  </span>
                </div>
                <div className="team-body">
                  <h5>{t("QuiSommesNous.Mon engagement", "Mon engagement")}</h5>
                  <span>
                    {membre.engagement &&
                      t(
                        "QuiSommesNous.engagement-" + membre.firstName,
                        membre.engagement
                      )}
                  </span>
                  <h5>{t("QuiSommesNous.Mon rôle", "Mon rôle")}</h5>
                  <span>
                    {membre.role &&
                      t("QuiSommesNous.role-" + membre.firstName, membre.role)}
                  </span>
                  <h5>{t("QuiSommesNous.Mes outils", "Mes outils")}</h5>
                  <span>{membre.outils}</span>
                </div>
                <div className="team-footer">
                  <a href={membre.linkedin} className="no-decoration">
                    <FButton type="outline" name="link-2-outline">
                      Linkedin
                    </FButton>
                  </a>
                </div>
                <EVAIcon
                  onClick={this._closeSide}
                  name="close-outline"
                  className="close-btn"
                />
              </div>
            )}
          </div>
        </section>

        <section id="problematique">
          <div className="section-container">
            <h2>{t("QuiSommesNous.Problématique", "Problématique")}</h2>

            <Row className="card-row">
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>
                    {t(
                      "QuiSommesNous.problem_1_header",
                      "Comprendre le statut de réfugié"
                    )}
                  </CardHeader>
                  <CardBody>
                    <span>
                      {t(
                        "QuiSommesNous.problem_1_subheader",
                        "Mieux comprendre c'est déjà mieux accueillir. Migrant, demandeur d'asile ou réfugié ne désignent pas les mêmes réalités. Réfugiés.info s'adresse aux réfugiés statutaires, c'est-à-dire aux personnes à qui la France accorde une protection internationale car leur vie est menacée dans leur pays d'origine"
                      )}
                      .
                    </span>
                  </CardBody>
                  {/* <CardFooter>
                    <FButton type="outline-black">
                      En savoir plus
                    </FButton>
                  </CardFooter> */}
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>
                    {t(
                      "QuiSommesNous.problem_2_header",
                      "Une information cryptée, dispersée et périssable"
                    )}
                  </CardHeader>
                  <CardBody>
                    <span>
                      {t(
                        "QuiSommesNous.problem_2_subheader",
                        "L’évolution rapide de la législation, le foisonnement de l’offre associative et la complexité de certaines démarches administratives rendent difficile la compréhension des droits et devoirs. Réfugiés.info centralise une information fiable, à jour et vulgarisée"
                      )}
                      .
                    </span>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>
                    {t(
                      "QuiSommesNous.problem_3_header",
                      "Des ruptures d'accompagnement"
                    )}
                  </CardHeader>
                  <CardBody>
                    <span>
                      {t(
                        "QuiSommesNous.problem_3_subheader",
                        "Déménagement, changement de projet de vie... À chaque nouvel interlocuteur, il faut souvent tout reprendre à zéro. Réfugiés.info propose aux réfugiés de se créer un parcours dans un espace personnel qu'il peuvent partager avec leurs aidants"
                      )}
                      .
                    </span>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        <section id="approche">
          <div className="section-container">
            <h2>
              {t(
                "QuiSommesNous.Approche contributive",
                "Approche contributive"
              )}
            </h2>

            <Row className="card-row">
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>
                    {t(
                      "QuiSommesNous.contributive_1_header",
                      "Un projet entièrement ouvert"
                    )}
                  </CardHeader>
                  <CardBody>
                    <span>
                      {t(
                        "QuiSommesNous.contributive_1_subheader",
                        "Les valeurs d’ouverture et de transparence sont au coeur du projet Réfugiés.info : le code source du site est entièrement disponible. Un réseau ouvert participe à la conception et conseille l’équipe du projet sur les besoins et les fonctionnalités à développer"
                      )}
                      .
                    </span>
                  </CardBody>
                  <CardFooter>
                    <a
                      href="https://github.com/entrepreneur-interet-general/karfur"
                      className="no-decoration"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FButton type="outline-black">
                        {t(
                          "QuiSommesNous.Voir le code source",
                          "Voir le code source"
                        )}
                      </FButton>
                    </a>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>
                    {t(
                      "QuiSommesNous.contributive_2_header",
                      "Le terrain aux commandes"
                    )}
                  </CardHeader>
                  <CardBody>
                    <span>
                      {t(
                        "QuiSommesNous.contributive_2_subheader",
                        "Seuls les acteurs locaux sont capables de recenser efficacement les actions et de nourrir une base de connaissance commune. Ainsi Réfugiés.info permet à chaque territoire de recenser et de valoriser ses initiatives tout en découvrant de nouvelles"
                      )}
                      .
                    </span>
                  </CardBody>
                  <CardFooter>
                    <FButton
                      tag={"a"}
                      href="https://agi-r.mn.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      type="outline-black"
                    >
                      {t("Rejoindre le réseau", "Rejoindre le réseau")}
                    </FButton>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>
                    {t(
                      "QuiSommesNous.contributive_3_header",
                      "Favoriser le micro-engagement"
                    )}
                  </CardHeader>
                  <CardBody>
                    <span>
                      {t(
                        "QuiSommesNous.contributive_3_subheader",
                        "En donnant à chacun la possibilité d’être facilement acteur et contributeur de la plateforme, à l’instar de Wikipédia, Réfugiés.info favorise de nouvelles formes de micro-engagement permettant à de nouveaux publics de s’engager pour une cause de solidarité, en faveur des réfugiés"
                      )}
                      .
                    </span>
                  </CardBody>
                  <CardFooter>
                    <FButton
                      tag={NavLink}
                      to="/backend/user-profile"
                      type="outline-black"
                    >
                      {t("Contribuer", "Contribuer")}
                    </FButton>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        {/*<section id="partenaires">
          <div className="section-container">
            <h2>Partenaires</h2>

            <h3>Institutionnels</h3>
            <Row className="partner-row">
              <Col lg="2"/>
              <Col lg="3" className="partner-col d-flex justify-content-center">
                <img className="partner-img" src={diair} alt="logo DIAIR" />
              </Col>
              <Col lg="1"/>
              <Col lg="4" className="partner-col">
                La Diair est à l’origine de la création du projet et héberge actuellement l’équipe projet. 
              </Col>
            </Row>
            {/* <Row className="partner-row">
              <Col lg="2"/>
              <Col lg="3" className="partner-col d-flex justify-content-center">
                <img className="partner-img" src={DGEF} alt="logo DGEF" />
              </Col>
              <Col lg="1"/>
              <Col lg="4" className="partner-col">
                La Diair est à l’origine de la création du projet et héberge actuellement l’équipe projet. 
              </Col>
            </Row>
            <h3>Associatifs</h3>
          </div>
        </section>*/}
      </div>
    );
  }
}

export default track({
  page: "QuiSommesNous",
})(withTranslation()(QuiSommesNous));
