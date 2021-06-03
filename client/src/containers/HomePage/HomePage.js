import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";
import { connect } from "react-redux";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { toggleLangueModalActionCreator } from "../../services/Langue/langue.actions";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
import FButton from "../../components/FigmaUI/FButton/FButton";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import "./HomePage.scss";
import { colors } from "colors";
import { initial_data } from "../AdvancedSearch/data";
import HomeSearch from "./HomeSearch";
import CatList from "./CatList";
import { initGA, PageView } from "../../tracking/dispatch";
import { iphone } from "../../assets/figma";
import { HomeCard } from "./HomeCard";
import { HomePageMobile } from "./HomePageMobile/HomePageMobile";
import { SubscribeNewsletterModal } from "../Footer/SubscribeNewsletterModal/SubscribeNewsletterModal";
import { BecomeTesterModal } from "./BecomeTesterModal";
import { MobileSearchFilterModal } from "../AdvancedSearch/MobileAdvancedSearch/MobileSearchFilterModal/MobileSearchFilterModal";
import {
  illustration_homeCard_dispositif,
  illustration_homeCard_annuaire,
  illustration_homeCard_demarche,
  illustration_homeCard_lexique,
} from "../../assets/figma";
import icon_mobilisation from "../../assets/icon_mobilisation.svg";
import { assetsOnServer } from "../../assets/assetsOnServer";
import i18n from "../../i18n";

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
  margin: ${(props) => (props.isRTL ? "0 0 0 20px" : "0 20px 0 0")};
`;

const MainTitleContainer = styled.div`
  font-size: ${isMobile ? "28px" : "52px"};
  font-weight: 700;
  padding: 0 60px;
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0px;
`;
const ButtonContainerRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const ButtonSeparator = styled.div`
  margin: 0px 10px 0px 0px;
`;

export class HomePage extends Component {
  constructor(props) {
    super(props);
    this.selectParam = this.selectParam.bind(this); //Placé ici pour être reconnu par les tests unitaires
  }
  state = {
    corona: false,
    popup: false,
    overlay: false,
    showGoToDesktopModal: false,
    showTagModal: false,
    showNewslettreModal: false,
    showBecomeTesterModal: false,
  };
  _isMounted = false;

  componentDidMount() {
    initGA();
    PageView();
    this._isMounted = true;
    window.scrollTo(0, 0);
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
  selectOption = (item) => {
    this.props.history.push({
      pathname: "/advanced-search",
      state: item.name,
    });
  };
  togglePopup = () => {
    this.setState({ popup: !this.state.popup });
  };
  toggleShowTagModal = () => {
    this.setState({ showTagModal: !this.state.showTagModal });
  };
  toggleShowNewsletterModal = () => {
    this.setState({ showNewslettreModal: !this.state.showNewslettreModal });
  };

  toggleBecomeTesterModal = () => {
    this.setState({ showBecomeTesterModal: !this.state.showBecomeTesterModal });
  };

  closeCorona = () => {
    this.setState({ corona: false });
  };

  toggleOverlay = () => {
    this.setState({ overlay: !this.state.overlay });
  };

  render() {
    const { t } = this.props;
    const item = initial_data[0];
    const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
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
              {t("Dispositifs.Header", "Construire sa vie en France")}
            </MainTitleContainer>
            <h5>{t("Homepage.title")}</h5>

            <div className="search-row">
              <HomeSearch
                className="on-homepage"
                item={item}
                keyValue={0}
                togglePopup={this.togglePopup}
                selectParam={this.selectParam}
                desactiver={() => {}}
                toggleOverlay={this.toggleOverlay}
                history={this.props.history}
                toggleModal={this.toggleShowTagModal}
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
          <CardContainer isRTL={isRTL}>
            <HomeCard
              t={t}
              text="Homepage.Trouver une initiative"
              defaultText="Trouver un programme ou une formation"
              buttonTitle="Homepage.Je cherche"
              defaultBoutonTitle="Je cherche"
              iconName="search-outline"
              backgroundColor={colors.blueGreen}
              textColor={colors.blancSimple}
              image={illustration_homeCard_dispositif}
              isDisabled={false}
              onClick={() => {
                this.props.history.push({
                  pathname: "/advanced-search",
                  search: isMobile ? null : "?filter=Dispositifs",
                });
              }}
            />
            <HomeCard
              t={t}
              text="Homepage.Comprendre les démarches administratives"
              defaultText="Comprendre les démarches administratives"
              buttonTitle="Homepage.Je cherche"
              defaultBoutonTitle="Je cherche"
              iconName="search-outline"
              backgroundColor={colors.lightBlue2}
              textColor={colors.blancSimple}
              image={illustration_homeCard_demarche}
              isDisabled={false}
              onClick={() => {
                this.props.history.push({
                  pathname: "/advanced-search",
                  search: isMobile ? null : "?filter=Démarches",
                });
              }}
            />
            <HomeCard
              t={t}
              text="Homepage.Consulter l'annuaire pour trouver une association"
              defaultText="Consulter l'annuaire pour trouver une association"
              buttonTitle={
                isMobile
                  ? "Homepage.Disponible sur ordinateur"
                  : "Homepage.Consulter l’annnuaire"
              }
              defaultBoutonTitle={
                isMobile ? "Disponible sur ordinateur" : "Consulter l’annnuaire"
              }
              iconName={isMobile ? "alert-circle-outline" : "search-outline"}
              backgroundColor={colors.purple}
              textColor={colors.blancSimple}
              image={illustration_homeCard_annuaire}
              isDisabled={isMobile ? true : false}
              onClick={() => {
                this.props.history.push({
                  pathname: "/annuaire",
                });
              }}
            />
            <HomeCard
              t={t}
              text="Homepage.Lire le lexique"
              defaultText="Lire le lexique pour comprendre les mots difficiles"
              buttonTitle="Homepage.Bientôt disponible"
              defaultBoutonTitle="Bientôt disponible"
              iconName="alert-circle-outline"
              backgroundColor={colors.whiteBlue}
              textColor={colors.bleuCharte}
              image={illustration_homeCard_lexique}
              isDisabled={true}
            />
          </CardContainer>
        </section>

        {isMobile ? (
          <HomePageMobile t={t} />
        ) : (
          <>
            <section id="contribution" className="contrib">
              <div className="section-container half-width right-side">
                <div className="section-body">
                  <h2>{t("Homepage.contribution")}</h2>
                  <p className="texte-normal">
                    {t("Homepage.contribution subheader")}
                  </p>
                </div>
                <footer className="footer-section">
                  <FButton
                    name="file-add-outline"
                    tag={NavHashLink}
                    to="/comment-contribuer"
                    type="dark"
                    style={{ height: "60px" }}
                  >
                    {t("Homepage.Je contribue", "Je contribue")}
                  </FButton>
                </footer>
              </div>
            </section>

            <section id="ecrire">
              <div className="section-container half-width left-side">
                <div className="section-body">
                  <h2>{t("Homepage.Faites connaitre")}</h2>
                  <p className="texte-normal">
                    {t("Homepage.Faites connaitre subheader")}
                  </p>
                </div>
                <footer>
                  <FButton
                    name="file-add-outline"
                    tag={NavHashLink}
                    to="/comment-contribuer#ecrire"
                    type="dark"
                    style={{ height: "60px" }}
                  >
                    {t("Homepage.Je propose une fiche", "Je propose une fiche")}
                  </FButton>
                </footer>
              </div>
            </section>

            <section id="multilangues">
              <div className="section-container half-width right-side">
                <div className="section-body">
                  <h2>{t("Homepage.aidez-nous à taduire")}</h2>
                  <p className="texte-normal">
                    {t("Homepage.aidez-nous à taduire subheader")}
                  </p>
                  {/*<LanguageBtn />*/}
                </div>
                <footer className="footer-section">
                  <FButton
                    name="file-add-outline"
                    tag={NavHashLink}
                    to={"/comment-contribuer#traduire"}
                    type="dark"
                    style={{ height: "60px" }}
                  >
                    {t("Homepage.J'aide à traduire", "J'aide à traduire")}
                  </FButton>
                </footer>
              </div>
            </section>
            <section
              id="deployer"
              style={{
                backgroundImage: `url(${assetsOnServer.homepage.CarteDeploiement})`,
              }}
            >
              <div className="section-container half-width left-side">
                <div className="section-body">
                  <h2>{t("Homepage.Déployez")}</h2>
                  <p className="texte-normal">
                    {t("Homepage.Déployez subheader")}
                  </p>
                </div>
                <footer className="footer-section">
                  <ButtonContainerRow>
                    <ButtonSeparator>
                      <FButton
                        tag={NavHashLink}
                        to={"/comment-contribuer#deployer-card"}
                        type="dark"
                        style={{ height: "60px" }}
                      >
                        <img src={icon_mobilisation} alt="icon mobilisation" />
                        {t(
                          "Homepage.Participe déploiement",
                          "Je participe au déploiement"
                        )}
                      </FButton>
                    </ButtonSeparator>
                    <FButton
                      tag={NavHashLink}
                      to={"/comment-contribuer#deployer-card"}
                      type="outline-black"
                      style={{ height: "60px" }}
                    >
                      {t(
                        "Homepage.Vous hésitez encore ?",
                        "Vous hésitez encore ?"
                      )}
                    </FButton>
                  </ButtonContainerRow>
                </footer>
              </div>
            </section>
            <section id="smartphone">
              <img src={iphone} />
              <div className="section-container half-width right-side smartphone">
                <div className="section-body smartphone">
                  <h2>
                    {t(
                      "Homepage.Bientôt sur smartphone",
                      "Bientôt sur smartphone"
                    )}
                  </h2>
                  <p className="texte-normal">
                    {t("Homepage.Bientôt sur smartphone subheader")}
                  </p>
                  {/*<LanguageBtn />*/}
                </div>
                <ButtonContainer>
                  <p>
                    <FButton
                      name="email-outline"
                      tag={NavHashLink}
                      to={"/"}
                      onClick={() => this.toggleShowNewsletterModal()}
                      type="white"
                    >
                      {t(
                        "Homepage.informé du lancement",
                        "Je veux être informé du lancement"
                      )}
                    </FButton>
                  </p>
                  <FButton
                    name="eye-outline"
                    tag={NavHashLink}
                    to={""}
                    onClick={() => this.toggleBecomeTesterModal()}
                    type="white"
                  >
                    {t(
                      "Homepage.Je veux tester l'application mobile",
                      "Je veux tester l'application mobile"
                    )}
                  </FButton>
                </ButtonContainer>
              </div>
            </section>
          </>
        )}
        <MobileSearchFilterModal
          t={t}
          selectOption={this.selectOption}
          type="thème"
          title="Tags.thème"
          defaultTitle="thème"
          sentence="SearchItem.J'ai besoin de"
          defaultSentence="J'ai besoin de'"
          toggle={this.toggleShowTagModal}
          show={this.state.showTagModal}
        />
        <SubscribeNewsletterModal
          toggle={this.toggleShowNewsletterModal}
          show={this.state.showNewslettreModal}
          t={t}
        />
        <BecomeTesterModal
          toggle={this.toggleBecomeTesterModal}
          show={this.state.showBecomeTesterModal}
        />
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
