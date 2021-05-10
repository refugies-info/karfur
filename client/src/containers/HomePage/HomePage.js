import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { NavLink, Link } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";
import { connect } from "react-redux";
//import { Row, Col, Card, CardHeader, CardBody, CardFooter } from "reactstrap";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { toggleLangueModalActionCreator } from "../../services/Langue/langue.actions";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import FButton from "../../components/FigmaUI/FButton/FButton";
import API from "../../utils/API";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import "./HomePage.scss";
import { colors } from "colors";
import { initial_data } from "../AdvancedSearch/data";
import HomeSearch from "./HomeSearch";
import CatList from "./CatList";
import { initGA, PageView } from "../../tracking/dispatch";
import { HomeCard } from "./HomeCard";
import {
  illustration_homeCard_dispositif,
  illustration_homeCard_annuaire,
  illustration_homeCard_demarche,
  //illustration_homeCard_lexique,
} from "../../assets/figma";

const CoronaAlert = styled.div`
  display: flex;
  border-radius: 12px 12px 12px 12px;
  background-color: #ffcecb;
  width: 100%;
  justify-content: center;
  padding: 15px;
  top: 0px;
  margin-top: -70px;
`;

const AlertText = styled.div`
  color: #f44336;
  font-weight: bold;
  padding: 0px;
  margin-bottom: 0px;
`;

const AlertTextLink = styled.p`
  color: #f44336;
  font-weight: bold;
  text-decoration: underline;
  margin-bottom: 0px;
`;

const CloseCorona = styled.div`
  margin-right: 10px;
  margin-top: 10px;
  cursor: pointer;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  justify-content: ${isMobile ? "" : "center"};
  margin: 0 20px;
`;

const MainTitleContainer = styled.div`
  font-size: ${isMobile ? "28px" : "52px"};
  font-weight: 700;
  padding: 0 60px;
`;
export class HomePage extends Component {
  constructor(props) {
    super(props);
    this.selectParam = this.selectParam.bind(this); //Placé ici pour être reconnu par les tests unitaires
  }
  state = {
    nbContributors: 0,
    nbTraductors: 0,
    corona: false,
    popup: false,
    overlay: false,
  };
  _isMounted = false;

  componentDidMount() {
    initGA();
    PageView();
    this._isMounted = true;
    window.scrollTo(0, 0);
    return API.getFiguresOnUsers().then((data) => {
      this._isMounted &&
        this.setState({
          nbContributors: data.data.data.nbContributors,
          nbTraductors: data.data.data.nbTraductors,
        });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  selectParam(_, subitem) {
    return (
      subitem &&
      this.props.history.push({
        pathname: "/advanced-search",
        search: "?tag=" + subitem.name,
      })
    );
  }

  togglePopup = () => {
    this.setState({ popup: !this.state.popup });
  };

  closeCorona = () => {
    this.setState({ corona: false });
  };

  toggleOverlay = () => {
    this.setState({ overlay: !this.state.overlay });
  };

  render() {
    const { t } = this.props;
    const { nbContributors, nbTraductors } = this.state;
    const item = initial_data[0];
    item.title = "J'ai besoin de";
    return (
      <div className="animated fadeIn homepage">
        {this.state.overlay ? <div className="overlay" /> : null}
        <section id="hero">
          <div className="hero-container">
            {this.state.corona ? (
              <CoronaAlert>
                <div style={{ padding: 10 }}>
                  <EVAIcon fill={"#f44336"} name="alert-triangle" />
                </div>
                <div style={{ padding: 10 }}>
                  <AlertText>
                    {t("Homepage.Covid alert")}
                    <br />
                    <Link
                      to={{
                        pathname: "/advanced-search",
                        search: "?tag=Santé",
                      }}
                    >
                      <AlertTextLink>{t("Homepage.Covid link")}</AlertTextLink>
                    </Link>
                  </AlertText>
                </div>
                <CloseCorona onClick={this.closeCorona}>
                  <EVAIcon fill={"#f44336"} name="close-outline" />
                </CloseCorona>
              </CoronaAlert>
            ) : null}
            <MainTitleContainer>
              {t(
                "Homepage.Construis ta vie en France",
                "Construire ma vie en France"
              )}
            </MainTitleContainer>
            <h5>{t("Homepage.subtitle")}</h5>

            <div className="search-row">
              <HomeSearch
                className="on-homepage"
                item={item}
                keyValue={0}
                togglePopup={this.togglePopup}
                selectParam={this.selectParam}
                desactiver={() => {}}
                toggleOverlay={this.toggleOverlay}
              />
            </div>
          </div>
          {this.state.popup ? (
            <CatList
              className="on-homepage"
              item={item}
              keyValue={0}
              togglePopup={this.togglePopup}
              selectParam={this.selectParam}
              desactiver={() => {}}
            />
          ) : null}
          <div className="chevron-wrapper">
            <AnchorLink
              offset="60"
              href="#plan"
              className="header-anchor d-inline-flex justify-content-center align-items-center"
            >
              <div className="slide-animation">
                <EVAIcon
                  className="bottom-slider"
                  name="arrow-circle-down"
                  size="xhero"
                  fill={colors.blancSimple}
                />
              </div>
            </AnchorLink>
          </div>
        </section>

        <section id="plan" className="triptique">
          <CardContainer>
            <HomeCard
              t={t}
              text="Trouver un programme"
              defaultText="Trouver un programme ou une formation"
              buttonTitle="Je cherche"
              defaultBoutonTitle="Je cherche"
              iconName="search-outline"
              backgroundColor={colors.blueGreen}
              textColor={colors.blancSimple}
              image={illustration_homeCard_dispositif}
              isDisabled={false}
              onClick={() => {
                this.props.history.push({
                  pathname: "/advanced-search",
                  state: "clean-filters",
                });
              }}
            />
            <HomeCard
              t={t}
              text="Comprendre les démarches administratives"
              defaultText="Comprendre les démarches administratives"
              buttonTitle="Je cherche"
              defaultBoutonTitle="Je cherche"
              iconName="search-outline"
              backgroundColor={colors.lightBlue}
              textColor={colors.blancSimple}
              image={illustration_homeCard_demarche}
              isDisabled={false}
              onClick={() => {
                this.props.history.push({
                  pathname: "/advanced-search",
                  state: "clean-filters",
                });
              }}
            />
            <HomeCard
              t={t}
              text="Consulter l'annuaire pour trouver une association"
              defaultText="Consulter l'annuaire pour trouver une association"
              buttonTitle={
                isMobile ? "disponible sur ordinateur" : "voir l'annuaire"
              }
              defaultBoutonTitle={
                isMobile ? "disponible sur ordinateur" : "voir l'annuaire"
              }
              iconName={isMobile ? "alert-circle" : "search-outline"}
              backgroundColor={colors.purple}
              textColor={colors.blancSimple}
              image={illustration_homeCard_annuaire}
              isDisabled={isMobile ? true : false}
              onClick={() => {
                this.props.history.push({
                  pathname: "/advanced-search",
                  state: "clean-filters",
                });
              }}
            />
            {/* <HomeCard
              t={t}
              text="Trouver un programme"
              defaultText="Lire le lexique pour comprendre les mots difficiles"
              buttonTitle="bientôt disponible"
              defaultBoutonTitle="bientôt disponible"
              iconName="alert-circle"
              backgroundColor={colors.whiteBlue}
              textColor={colors.bleuCharte}
              image={illustration_homeCard_lexique}
              isDisabled={true}
            /> */}
          </CardContainer>
        </section>

        {!isMobile && (
          <section id="contribution" className="contrib">
            <div className="section-container half-width">
              <div className="section-body">
                <h2>{t("Homepage.contributive")}</h2>
                <p className="texte-normal">
                  {t("Homepage.contributive subheader")}
                  <NavLink className="link ml-10" to="/qui-sommes-nous">
                    {t("En savoir plus", "En savoir plus")}
                  </NavLink>
                </p>
              </div>
              <footer className="footer-section">
                {t("Homepage.contributeurs mobilises", {
                  nombre: nbContributors,
                })}{" "}
                <FButton
                  tag={NavHashLink}
                  to="/comment-contribuer#ecrire"
                  type="dark"
                >
                  {t("Homepage.Je contribue", "Je contribue")}
                </FButton>
              </footer>
            </div>
          </section>
        )}

        {!isMobile && (
          <section id="multilangues">
            <div className="section-container half-width right-side">
              <div className="section-body">
                <h2>{t("Homepage.disponible langues")}</h2>
                <p className="texte-normal">
                  {t("Homepage.disponible langues subheader")}
                </p>
                {/*<LanguageBtn />*/}
              </div>
              <footer className="footer-section">
                {t("Homepage.traducteurs mobilises", {
                  nombre: nbTraductors,
                })}{" "}
                <FButton
                  tag={NavHashLink}
                  to={
                    API.isAuth()
                      ? "/backend/user-translation"
                      : "/comment-contribuer#traduire"
                  }
                  type="dark"
                >
                  {t("Homepage.Je traduis", "Je traduis")}
                </FButton>
              </footer>
            </div>
          </section>
        )}

        {!isMobile && (
          <section id="certifiee">
            <div className="section-container half-width">
              <div className="section-body">
                <h2>{t("Homepage.information vérifiée")}</h2>
                <p className="texte-normal">
                  {t("Homepage.information vérifiée subheader")}
                </p>
              </div>
              <footer>
                <FButton
                  tag={NavHashLink}
                  to="/comment-contribuer#corriger"
                  type="dark"
                >
                  {t("En savoir plus", "En savoir plus")}
                </FButton>
              </footer>
            </div>
          </section>
        )}

        {!isMobile && (
          <section id="explique">
            <div className="section-container half-width right-side">
              <h2>
                {t(
                  "Homepage.Explique les mots difficiles",
                  "Explique les mots difficiles"
                )}
              </h2>
              <p className="texte-normal">
                {t("Homepage.explication lexique")}
              </p>
              <span className="texte-normal">
                {t("Bientôt disponible !", "Bientôt disponible !")}
              </span>
            </div>
          </section>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.langue.languei18nCode,
  };
};

const mapDispatchToProps = {
  toggleLangueModal: toggleLangueModalActionCreator,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(HomePage));
