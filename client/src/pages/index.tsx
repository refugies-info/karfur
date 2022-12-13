import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import qs from "query-string";
import { colors } from "colors";
import { HomeCard } from "components/Pages/homepage/HomeCard";
import UkrainePopup from "components/Pages/homepage/UkrainePopup";
import { HomePageMobile } from "components/Pages/homepage/HomePageMobile/HomePageMobile";
import MobileAppSection from "components/Pages/homepage/MobileAppSection";
import HomeSearch from "components/Pages/homepage/HomeSearch";
import CatList from "components/Pages/homepage/CatList";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/UI/FButton";
import { themesSelector } from "services/Themes/themes.selectors";
import {
  illustration_homeCard_dispositif,
  illustration_homeCard_annuaire,
  illustration_homeCard_demarche,
  illustration_homeCard_lexique
} from "assets/figma";
import icon_mobilisation from "assets/icon_mobilisation.svg";
import { assetsOnServer } from "assets/assetsOnServer";
import SEO from "components/Seo";
import { defaultStaticPropsWithThemes } from "lib/getDefaultStaticProps";
import useRTL from "hooks/useRTL";
import isInBrowser from "lib/isInBrowser";
import styles from "scss/pages/homepage.module.scss";
import { getPath } from "routes";
import { MobileTagsModal } from "components/Pages/homepage/MobileTagsModal/MobileTagsModal";
import { toggleNewsletterModalAction } from "services/Miscellaneous/miscellaneous.actions";

const ButtonContainerRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const ButtonSeparator = styled.div`
  margin-right: ${(props: { isRTL: boolean }) => (props.isRTL ? "0px" : "10px")};
  margin-left: ${(props: { isRTL: boolean }) => (props.isRTL ? "10px" : "0px")};
`;

interface Props {}

const Homepage = (props: Props) => {
  const dispatch = useDispatch();
  const [popup, setPopup] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);

  const [ukraine, setUkraine] = useState(true);

  const { t } = useTranslation();
  const router = useRouter();
  const selectOption = (themeId: string) => {
    router.push({
      pathname: getPath("/recherche", router.locale),
      search: qs.stringify({ themes: themeId })
    });
  };

  const togglePopup = () => setPopup(!popup);
  const toggleShowTagModal = () => setShowTagModal(!showTagModal);
  const toggleOverlay = () => setOverlay(!overlay);
  const themes = useSelector(themesSelector);
  const isRTL = useRTL();

  useEffect(() => {
    if (isInBrowser() && new URLSearchParams(window.location.search).get("newsletter") === "") {
      dispatch(toggleNewsletterModalAction(true));
    }
  }, []);

  return (
    <div className="animated fadeIn homepage">
      <SEO title="Accueil" description={t("Homepage.title")} />
      {overlay ? <div className="overlay" /> : null}
      <section className={styles.hero}>
        <div className="hero-container">
          {ukraine && <UkrainePopup />}
          <h1 className={styles.title}>{t("Dispositifs.Header", "Construire sa vie en France")}</h1>
          <h2 className={styles.subtitle}>{t("Homepage.title")}</h2>

          <div className="search-row">
            <HomeSearch togglePopup={togglePopup} toggleOverlay={toggleOverlay} toggleModal={toggleShowTagModal} />
          </div>
        </div>
        {popup ? <CatList themes={themes} /> : null}
        <div className="chevron-wrapper">
          <a href="#plan" className="header-anchor d-inline-flex justify-content-center align-items-center">
            <div className="slide-animation">
              <EVAIcon
                className={isRTL ? "bottom-slider-rtl" : "bottom-slider"}
                name="arrow-circle-down"
                size="xhero"
                fill={colors.white}
              />
            </div>
          </a>
        </div>
      </section>

      <section id="plan" className={`${styles.section} ${styles.triptique}`}>
        <div className={styles.cards_container}>
          <HomeCard
            text="Homepage.Trouver une initiative"
            defaultText="Trouver un programme ou une formation"
            buttonTitle="Homepage.Je cherche"
            defaultBoutonTitle="Je cherche"
            iconName="search-outline"
            backgroundColor={colors.blueGreen}
            textColor={colors.white}
            image={illustration_homeCard_dispositif}
            isDisabled={false}
            onClick={() => {
              router.push({
                pathname: getPath("/recherche", router.locale),
                search: isMobile ? null : "?type=dispositif"
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
            textColor={colors.white}
            image={illustration_homeCard_demarche}
            isDisabled={false}
            onClick={() => {
              router.push({
                pathname: getPath("/recherche", router.locale),
                search: isMobile ? null : "?type=demarche"
              });
            }}
          />
          <HomeCard
            text="Homepage.Consulter l'annuaire pour trouver une association"
            defaultText="Consulter l'annuaire pour trouver une association"
            buttonTitle={isMobile ? "Homepage.Disponible sur ordinateur" : "Homepage.Consulter l’annnuaire"}
            defaultBoutonTitle={isMobile ? "Disponible sur ordinateur" : "Consulter l’annnuaire"}
            iconName={isMobile ? "alert-circle-outline" : "search-outline"}
            backgroundColor={colors.purple}
            textColor={colors.white}
            image={illustration_homeCard_annuaire}
            isDisabled={isMobile ? true : false}
            onClick={() => {
              router.push({
                pathname: getPath("/annuaire", router.locale)
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
        </div>
      </section>

      {isMobile ? (
        <HomePageMobile />
      ) : (
        <>
          <MobileAppSection />
          <section id="contribution" className={`${styles.section} ${styles.contribution}`}>
            <div className="section-container half-width right-side">
              <div className="section-body">
                <h2>{t("Homepage.contribution")}</h2>
                <p>{t("Homepage.contribution subheader")}</p>
              </div>
              <footer className="footer-section">
                <Link legacyBehavior href={getPath("/publier", router.locale)} passHref>
                  <FButton name="file-add-outline" tag="a" tabIndex="1" type="dark" style={{ height: "60px" }}>
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
                <p>{t("Homepage.Faites connaitre subheader")}</p>
              </div>
              <footer>
                <Link legacyBehavior href={getPath("/publier", router.locale)} passHref>
                  <FButton name="file-add-outline" type="dark" tag="a" tabIndex="2" style={{ height: "60px" }}>
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
                <p>{t("Homepage.aidez-nous à taduire subheader")}</p>
                {/*<LanguageBtn />*/}
              </div>
              <footer className="footer-section">
                <Link legacyBehavior href={getPath("/traduire", router.locale)} passHref>
                  <FButton name="file-add-outline" type="dark" tag="a" tabIndex="3" style={{ height: "60px" }}>
                    {t("Homepage.J'aide à traduire", "J'aide à traduire")}
                  </FButton>
                </Link>
              </footer>
            </div>
          </section>
          <section id="deployer" className={`${styles.section} ${styles.deployer}`}>
            <div className="section-container half-width left-side" style={{ zIndex: 2, position: "relative" }}>
              <div className="section-body">
                <h2>{t("Homepage.Déployez")}</h2>
                <p>{t("Homepage.Déployez subheader")}</p>
              </div>
              <footer className="footer-section">
                <ButtonContainerRow>
                  <ButtonSeparator isRTL={isRTL}>
                    <Link legacyBehavior href={getPath("/publier", router.locale)} passHref>
                      <FButton type="dark" tag="a" tabIndex="4" style={{ height: "60px" }}>
                        <span className="mr-8">
                          <Image src={icon_mobilisation} alt="icon mobilisation" />
                        </span>
                        {t("Homepage.Participe déploiement", "Je participe au déploiement")}
                      </FButton>
                    </Link>
                  </ButtonSeparator>
                  <Link legacyBehavior href={getPath("/publier", router.locale)} passHref>
                    <FButton type="outline-black" tag="a" tabIndex="5" style={{ height: "60px" }}>
                      {t("Homepage.Vous hésitez encore ?", "Vous hésitez encore ?")}
                    </FButton>
                  </Link>
                </ButtonContainerRow>
              </footer>
            </div>
            <div
              className={styles.deployer_map}
              style={{
                backgroundImage: `url(${assetsOnServer.homepage.CarteDeploiement})`
              }}
            ></div>
          </section>
        </>
      )}
      <MobileTagsModal selectOption={selectOption} toggle={toggleShowTagModal} show={showTagModal} />
    </div>
  );
};

export const getStaticProps = defaultStaticPropsWithThemes;

export default Homepage;
