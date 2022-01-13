//@ts-nocheck
import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Link from 'next/link'
import {useRouter} from 'next/router'
import EVAIcon from "../components/UI/EVAIcon/EVAIcon";
import FButton from "../components/FigmaUI/FButton/FButton";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { colors } from "colors";
import {
  illustration_homeCard_dispositif,
  illustration_homeCard_annuaire,
  illustration_homeCard_demarche,
  illustration_homeCard_lexique,
} from "../assets/figma";
import { initial_data } from "../containers/AdvancedSearch/data";
import { initGA, PageView } from "../tracking/dispatch";
import { iphone } from "../assets/figma";
import { SubscribeNewsletterModal } from "../containers/Footer/SubscribeNewsletterModal/SubscribeNewsletterModal";
import { MobileSearchFilterModal } from "../containers/AdvancedSearch/MobileAdvancedSearch/MobileSearchFilterModal/MobileSearchFilterModal";
import icon_mobilisation from "../assets/icon_mobilisation.svg";
import { assetsOnServer } from "../assets/assetsOnServer";
import i18n from "../i18n";
import { HomeCard } from "../components/Pages/homepage/HomeCard";
import { BecomeTesterModal } from "../components/Pages/homepage/BecomeTesterModal";
import { HomePageMobile } from "../components/Pages/homepage/HomePageMobile/HomePageMobile";
import HomeSearch from "../components/Pages/homepage/HomeSearch";
import CatList from "../components/Pages/homepage/CatList";
// import "../components/Pages/homepage/HomePage.module.scss";

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
  color: white;
`;

const AlertTextLink = styled.a`
  color: white;
  text-decoration: underline;
  margin-bottom: 0px;
`;

const CloseCorona = styled.div`
  margin-right: 10px;
  margin-top: 10px;
  cursor: pointer;
`;

const CloseParrainage = styled.div`
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
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
  margin-right: ${(props) => (props.isRTL ? "0px" : "10px")};
  margin-left: ${(props) => (props.isRTL ? "10px" : "0px")};
`;

const Homepage = (props) => {

  const [corona, setCorona] = useState(false);
  const [popup, setPopup] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [showGoToDesktopModal, setShowGoToDesktopModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showNewslettreModal, setShowNewslettreModal] = useState(false);
  const [showBecomeTesterModal, setShowBecomeTesterModal] = useState(false);
  const [parrainage, setParrainage] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    initGA();
    PageView();
    window.scrollTo(0, 0);
  }, []);

  const selectParam = (_, subitem) => {
    return (
      subitem &&
      router.push({
        pathname: "/advanced-search",
        search: "?tag=" + subitem.name,
      })
    );
  }
  const selectOption = (item) => {
    router.push({
      pathname: "/advanced-search",
      state: item.name,
    });
  };
  const togglePopup = () => {
    setPopup(!popup);
  };
  const toggleShowTagModal = () => {
    setShowTagModal(!showTagModal);
  };
  const toggleShowNewsletterModal = () => {
    setShowNewslettreModal(!showNewslettreModal);
  };

  const toggleBecomeTesterModal = () => {
    setShowBecomeTesterModal(!showBecomeTesterModal);
  };

  const closeCorona = () => {
    setCorona(false);
  };
  const closeParrainage = () => {
    setParrainage(false);
  };

  const toggleOverlay = () => {
    setOverlay(!overlay);
  };

  const item = initial_data[0];
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
  item.title = "J'ai besoin de";

  return (
    <div className="animated fadeIn homepage">
      {overlay ? <div className="overlay" /> : null}
      <section id="hero">
        <div className="hero-container">
          {corona ? (
            <CoronaAlert>
              <div style={{ padding: 10 }}>
                <EVAIcon fill={"#f44336"} name="alert-triangle" />
              </div>
              <div style={{ padding: 10 }}>
                <AlertText>
                  {t("Homepage.Covid alert")}
                  <br />
                  <Link href="/advanced-search?tag=Santé">
                    <AlertTextLink>{t("Homepage.Covid link")}</AlertTextLink>
                  </Link>
                </AlertText>
              </div>
              <CloseCorona onClick={closeCorona}>
                <EVAIcon fill={"#f44336"} name="close-outline" />
              </CloseCorona>
            </CoronaAlert>
          ) : null}
          {parrainage ? (
            <div className="parrainage-alert">
              <AlertText>
                <span style={{ fontWeight: "bold" }}>Parrainez une personne réfugiée&nbsp;!</span> Découvrez les actions par thématique&nbsp;:
                <div style={{ flexDirection: "row" }}>
                  <Link href="/dispositif/616581b863933e00148153fe">
                    <AlertTextLink>Rencontres et loisirs</AlertTextLink>
                  </Link>
                  <span> / </span>
                  <Link href="/dispositif/61680552e389a200141c1c44">
                    <AlertTextLink>Éducation</AlertTextLink>
                  </Link>
                  <span> / </span>
                  <Link href="/dispositif/616ec622c8e422001419a0cd">
                    <AlertTextLink>Hébergement citoyen</AlertTextLink>
                  </Link>
                  <span> / </span>
                  <Link href="/dispositif/61681cafe389a200141c27e3">
                    <AlertTextLink>Insertion professionnelle</AlertTextLink>
                  </Link>
                </div>
              </AlertText>
              <CloseParrainage onClick={closeParrainage}>
                <EVAIcon fill={"white"} name="close-outline" />
              </CloseParrainage>
            </div>
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
              togglePopup={togglePopup}
              selectParam={selectParam}
              desactiver={() => {}}
              toggleOverlay={toggleOverlay}
              history={props.history}
              toggleModal={toggleShowTagModal}
            />
          </div>
        </div>
        {popup ? (
          <CatList
            className="on-homepage"
            item={item}
            keyValue={0}
            togglePopup={togglePopup}
            selectParam={selectParam}
            desactiver={() => {}}
          />
        ) : null}
        <div className="chevron-wrapper">
          <a
            offset="60"
            href="#plan"
            className="header-anchor d-inline-flex justify-content-center align-items-center"
          >
            <div className="slide-animation">
              <EVAIcon
                className={isRTL ? "bottom-slider-rtl" : "bottom-slider"}
                name="arrow-circle-down"
                size="xhero"
                fill={colors.blancSimple}
              />
            </div>
          </a>
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
              router.push({
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
              router.push({
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
              router.push({
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
          >
              <div
                className="section-container half-width left-side"
                style={{zIndex: 2, position: "relative"}}
              >
              <div className="section-body">
                <h2>{t("Homepage.Déployez")}</h2>
                <p className="texte-normal">
                  {t("Homepage.Déployez subheader")}
                </p>
              </div>
              <footer className="footer-section">
                <ButtonContainerRow>
                  <ButtonSeparator isRTL={isRTL}>
                    <FButton
                      to={"/comment-contribuer#deployer-card"}
                      type="dark"
                      style={{ height: "60px" }}
                    >
                      <img
                        src={icon_mobilisation}
                        alt="icon mobilisation"
                        className={"mr-8"}
                      />
                      {t(
                        "Homepage.Participe déploiement",
                        "Je participe au déploiement"
                      )}
                    </FButton>
                  </ButtonSeparator>
                  <FButton
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
            <div
              className="deployer_map"
              style={{
                backgroundImage: `url(${assetsOnServer.homepage.CarteDeploiement})`,
              }}
            ></div>
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
                    to={"/"}
                    onClick={() => toggleShowNewsletterModal()}
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
                  to={""}
                  onClick={() => toggleBecomeTesterModal()}
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
        selectOption={selectOption}
        type="thème"
        title="Tags.thème"
        defaultTitle="thème"
        sentence="SearchItem.J'ai besoin de"
        defaultSentence="J'ai besoin de'"
        toggle={toggleShowTagModal}
        show={showTagModal}
      />
      <SubscribeNewsletterModal
        toggle={toggleShowNewsletterModal}
        show={showNewslettreModal}
        t={t}
      />
      <BecomeTesterModal
        toggle={toggleBecomeTesterModal}
        show={showBecomeTesterModal}
      />
    </div>
  )
}

export default Homepage;
