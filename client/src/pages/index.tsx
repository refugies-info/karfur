import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import qs from "query-string";
import { colors } from "colors";
import { searchTheme } from "data/searchFilters";
import { SubscribeNewsletterModal } from "components/Modals/SubscribeNewsletterModal/SubscribeNewsletterModal";
import { MobileSearchFilterModal } from "components/Pages/advanced-search/MobileAdvancedSearch/MobileSearchFilterModal/MobileSearchFilterModal";
import { HomeCard } from "components/Pages/homepage/HomeCard";
import { BecomeTesterModal } from "components/Pages/homepage/BecomeTesterModal";
import { HomePageMobile } from "components/Pages/homepage/HomePageMobile/HomePageMobile";
import HomeSearch from "components/Pages/homepage/HomeSearch";
import CatList from "components/Pages/homepage/CatList";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/FigmaUI/FButton/FButton";
import iphone from "assets/figma/iphone.svg";
import {
  illustration_homeCard_dispositif,
  illustration_homeCard_annuaire,
  illustration_homeCard_demarche,
  illustration_homeCard_lexique,
} from "assets/figma";
import icon_mobilisation from "assets/icon_mobilisation.svg";
import { assetsOnServer } from "assets/assetsOnServer";
import styles from "scss/pages/homepage.module.scss";
import SEO from "components/Seo";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import useRTL from "hooks/useRTL";
import { tags } from "data/tags";

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
  font-weight: bold;
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

interface Props {}

const Homepage = (props: Props) => {
  const [corona, setCorona] = useState(false);
  const [popup, setPopup] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showNewslettreModal, setShowNewslettreModal] = useState(false);
  const [showBecomeTesterModal, setShowBecomeTesterModal] = useState(false);
  const [parrainage, setParrainage] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  const selectOption =  (tagName: string) => {
    router.push({
      pathname: "/advanced-search",
      search: qs.stringify({tag: tagName}),
    });
  };
  const togglePopup = () => setPopup(!popup);
  const toggleShowTagModal = () => setShowTagModal(!showTagModal);
  const toggleShowNewsletterModal = () => setShowNewslettreModal(!showNewslettreModal);
  const toggleBecomeTesterModal = () => setShowBecomeTesterModal(!showBecomeTesterModal);
  const closeCorona = () => setCorona(false);
  const closeParrainage = () => setParrainage(false);
  const toggleOverlay = () => setOverlay(!overlay);

  const isRTL = useRTL();

  return (
    <div className="animated fadeIn homepage">
      <SEO title="Accueil" />
      {overlay ? <div className="overlay" /> : null}
      <section className={styles.hero}>
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
                  <Link href="/advanced-search?tag=Santé" passHref>
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
                <span style={{ fontWeight: "bold" }}>
                  Parrainez une personne réfugiée&nbsp;!
                </span>{" "}
                Découvrez les actions par thématique&nbsp;:
                <div style={{ flexDirection: "row" }}>
                  <Link href="/dispositif/616581b863933e00148153fe" passHref>
                    <AlertTextLink>Rencontres et loisirs</AlertTextLink>
                  </Link>
                  <span> / </span>
                  <Link href="/dispositif/61680552e389a200141c1c44" passHref>
                    <AlertTextLink>Éducation</AlertTextLink>
                  </Link>
                  <span> / </span>
                  <Link href="/dispositif/616ec622c8e422001419a0cd" passHref>
                    <AlertTextLink>Hébergement citoyen</AlertTextLink>
                  </Link>
                  <span> / </span>
                  <Link href="/dispositif/61681cafe389a200141c27e3" passHref>
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
              searchItem={searchTheme}
              togglePopup={togglePopup}
              toggleOverlay={toggleOverlay}
              toggleModal={toggleShowTagModal}
            />
          </div>
        </div>
        {popup ? <CatList tags={tags} /> : null}
        <div className="chevron-wrapper">
          <a
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

      <section id="plan" className={`${styles.section} ${styles.triptique}`}>
        <CardContainer isRTL={isRTL}>
          <HomeCard
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
            text="Homepage.Lire le lexique"
            defaultText="Lire le lexique pour comprendre les mots difficiles"
            buttonTitle="Homepage.Bientôt disponible"
            defaultBoutonTitle="Bientôt disponible"
            iconName="alert-circle-outline"
            backgroundColor={colors.whiteBlue}
            textColor={colors.bleuCharte}
            image={illustration_homeCard_lexique}
            isDisabled={true}
            onClick={() => {}}
          />
        </CardContainer>
      </section>

      {isMobile ? (
        <HomePageMobile t={t} />
      ) : (
        <>
          <section id="contribution" className={`${styles.section} ${styles.contribution}`}>
            <div className="section-container half-width right-side">
              <div className="section-body">
                <h2>{t("Homepage.contribution")}</h2>
                <p>
                  {t("Homepage.contribution subheader")}
                </p>
              </div>
              <footer className="footer-section">
                <Link href="/comment-contribuer" passHref>
                  <FButton
                    name="file-add-outline"
                    tag="a"
                    tabIndex="1"
                    type="dark"
                    style={{ height: "60px" }}
                  >
                    {t("Homepage.Je contribue", "Je contribue")}
                  </FButton>
                </Link>
              </footer>
            </div>
          </section>

          <section id="ecrire" className={`${styles.section} ${styles.ecrire}`}>
            <div className="section-container half-width left-side">
              <div className="section-body">
                <h2>{t("Homepage.Faites connaitre")}</h2>
                <p>
                  {t("Homepage.Faites connaitre subheader")}
                </p>
              </div>
              <footer>
                <Link href="/comment-contribuer#ecrire" passHref>
                  <FButton
                    name="file-add-outline"
                    type="dark"
                    tag="a"
                    tabIndex="2"
                    style={{ height: "60px" }}
                  >
                    {t("Homepage.Je propose une fiche", "Je propose une fiche")}
                  </FButton>
                </Link>
              </footer>
            </div>
          </section>

          <section id="multilangues" className={`${styles.section} ${styles.multilangues}`}>
            <div className="section-container half-width right-side">
              <div className="section-body">
                <h2>{t("Homepage.aidez-nous à taduire")}</h2>
                <p>
                  {t("Homepage.aidez-nous à taduire subheader")}
                </p>
                {/*<LanguageBtn />*/}
              </div>
              <footer className="footer-section">
                <Link href="/comment-contribuer#traduire" passHref>
                  <FButton
                    name="file-add-outline"
                    type="dark"
                    tag="a"
                    tabIndex="3"
                    style={{ height: "60px" }}
                  >
                    {t("Homepage.J'aide à traduire", "J'aide à traduire")}
                  </FButton>
                </Link>
              </footer>
            </div>
          </section>
          <section id="deployer" className={`${styles.section} ${styles.deployer}`}>
            <div
              className="section-container half-width left-side"
              style={{ zIndex: 2, position: "relative" }}
            >
              <div className="section-body">
                <h2>{t("Homepage.Déployez")}</h2>
                <p>
                  {t("Homepage.Déployez subheader")}
                </p>
              </div>
              <footer className="footer-section">
                <ButtonContainerRow>
                  <ButtonSeparator isRTL={isRTL}>
                    <Link href="/comment-contribuer#deployer-card" passHref>
                      <FButton
                        type="dark"
                        tag="a"
                        tabIndex="4"
                        style={{ height: "60px" }}
                      >
                        <span className="mr-8">
                          <Image
                            src={icon_mobilisation}
                            alt="icon mobilisation"
                          />
                        </span>
                        {t(
                          "Homepage.Participe déploiement",
                          "Je participe au déploiement"
                        )}
                      </FButton>
                    </Link>
                  </ButtonSeparator>
                  <Link href="/comment-contribuer#deployer-card" passHref>
                    <FButton
                      type="outline-black"
                      tag="a"
                      tabIndex="5"
                      style={{ height: "60px" }}
                    >
                      {t(
                        "Homepage.Vous hésitez encore ?",
                        "Vous hésitez encore ?"
                      )}
                    </FButton>
                  </Link>
                </ButtonContainerRow>
              </footer>
            </div>
            <div
              className={styles.deployer_map}
              style={{
                backgroundImage: `url(${assetsOnServer.homepage.CarteDeploiement})`,
              }}
            ></div>
          </section>
            <section id="smartphone" className={`${styles.section} ${styles.smartphone}`}>
              <div className={styles.img}>
                <Image
                  src={iphone}
                  alt="iphone mockup"
                  width={480}
                  height={500}
                  objectFit="contain"
                />
              </div>
            <div className="section-container half-width right-side smartphone">
              <div className="section-body smartphone">
                <h2>
                  {t(
                    "Homepage.Bientôt sur smartphone",
                    "Bientôt sur smartphone"
                  )}
                </h2>
                <p>
                  {t("Homepage.Bientôt sur smartphone subheader")}
                </p>
                {/*<LanguageBtn />*/}
              </div>
              <ButtonContainer>
                <p>
                  <FButton
                    name="email-outline"
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
        selectOption={selectOption}
        type="theme"
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
      />
      <BecomeTesterModal
        toggle={toggleBecomeTesterModal}
        show={showBecomeTesterModal}
      />
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default Homepage;
