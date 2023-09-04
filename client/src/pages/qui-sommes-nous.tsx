import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import { Mission } from "components/Pages/qui-sommes-nous/Mission";
import { Problematic } from "components/Pages/qui-sommes-nous/Problematic";
import { Contribution } from "components/Pages/qui-sommes-nous/Contribution";
import { Team } from "components/Pages/qui-sommes-nous/Team";
import { Partners } from "components/Pages/qui-sommes-nous/Partners";
import { assetsOnServer } from "assets/assetsOnServer";
import SEO from "components/Seo";
import { NextPage } from "next";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import styles from "scss/pages/qui-sommes-nous.module.scss";

const MainContainer = styled.div`
  flex: 1;
  background: #ffffff;
`;
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${assetsOnServer.quiSommesNous.header});
  margin-top: -75px;
  width: 100%;
  height: 720px;
`;

const SubHeaderText = styled.h4`
  font-weight: 600;
`;
const HeaderTextContainer = styled.div`
  background: #ffffff;
  padding: 8px;
  margin-bottom: 4px;
`;

const NavBarContainer = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 75px;
  height: 68px;
  background: #f2f2f2;
  display: flex;
  flex-direction: center;
  justify-content: center;
  align-items: center;
  z-index: 1;
  top: ${(props: { isToolbarVisible: boolean }) => (!props.isToolbarVisible ? "0px !important" : "0px !important")};
`;

const NavBarText = styled.div`
  padding: 22px;
  height: 100%;
  &:hover {
    background: #212121;
    color: #f2f2f2;
  }

  background: ${(props: { isVisibleSection: boolean }) => (props.isVisibleSection ? "#212121" : "#f2f2f2")};
  color: ${(props: { isVisibleSection: boolean }) => (props.isVisibleSection ? "#f2f2f2" : "#212121")};
`;

const SectionHeader = styled.h2`
  text-align: center;
  margin-bottom: 48px;
`;
const MissionContainer = styled.div`
  height: 720px;
  padding-top: 48px;
`;
const TeamContainer = styled.div`
  background: #f2f2f2;
  padding-top: 48px;
  position: relative;
  padding-bottom: 30px;
`;
const ProblematicContainer = styled.div`
  height: 720px;
  padding-top: 48px;
  background: linear-gradient(105.8deg, #ffffff -3.98%, #f2f2f2 115.05%);
`;
const ContributionContainer = styled.div`
  height: 720px;
  padding-top: 48px;
  background: linear-gradient(105.8deg, #ffffff -3.98%, #f2f2f2 115.05%);
`;

const PartnersContainer = styled.div`
  padding-top: 48px;
  padding-left: 120px;
  padding-right: 32px;
`;

const QuiSommesNous: NextPage = () => {
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [visibleSection, setVisibleSection] = useState("");

  const { t } = useTranslation();

  // scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const visible = currentScrollPos < 720;
      let visibleSection = "";
      if (720 < currentScrollPos && currentScrollPos <= 1440) {
        visibleSection = "Missions";
      } else if (1440 < currentScrollPos && currentScrollPos <= 2290) {
        visibleSection = "Equipe";
      } else if (2290 < currentScrollPos && currentScrollPos <= 3010) {
        visibleSection = "Problematiques";
      } else if (3010 < currentScrollPos && currentScrollPos <= 3730) {
        visibleSection = "Contribution";
      } else if (3730 < currentScrollPos) {
        visibleSection = "Partenaires";
      }
      setIsToolbarVisible(visible);
      setVisibleSection(visibleSection);
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <MainContainer>
      <SEO title="Qui sommes nous ?" />
      <HeaderContainer>
        <div style={{ marginTop: 240, marginBottom: 28 }}>
          <HeaderTextContainer>
            <h1>{t("QuiSommesNous.Qui sommes-nous", "Qui sommes nous ?")}</h1>
          </HeaderTextContainer>
        </div>
        <HeaderTextContainer>
          <SubHeaderText>{t("QuiSommesNous.subheader1", "Réfugiés.info est un projet collaboratif")}</SubHeaderText>
        </HeaderTextContainer>
        <HeaderTextContainer>
          <SubHeaderText>
            {t("QuiSommesNous.subheader2", "porté par la Diair et développé par la Mednum")}
          </SubHeaderText>
        </HeaderTextContainer>
      </HeaderContainer>
      <NavBarContainer isToolbarVisible={isToolbarVisible}>
        <a href="#mission">
          <NavBarText isVisibleSection={visibleSection === "Missions"}>
            {t("QuiSommesNous.Missions", "Missions")}
          </NavBarText>
        </a>
        <a href="#equipe">
          <NavBarText isVisibleSection={visibleSection === "Equipe"}>{t("QuiSommesNous.team", "Équipe")}</NavBarText>
        </a>
        <a href="#problematic">
          <NavBarText isVisibleSection={visibleSection === "Problematiques"}>
            {t("QuiSommesNous.issues", "Problématiques")}
          </NavBarText>
        </a>
        <a href="#contribution">
          <NavBarText isVisibleSection={visibleSection === "Contribution"}>
            {t("QuiSommesNous.Approche contributive", "Approche contributive")}
          </NavBarText>
        </a>
        <a href="#partners">
          <NavBarText isVisibleSection={visibleSection === "Partenaires"}>
            {t("QuiSommesNous.Partenaires", "Partenaires")}
          </NavBarText>
        </a>
      </NavBarContainer>
      <MissionContainer className={styles.container}>
        <span id="mission" className={styles.anchor}></span>
        <SectionHeader>{t("QuiSommesNous.Missions", "Missions")}</SectionHeader>
        <Mission />
      </MissionContainer>
      <TeamContainer className={styles.container}>
        <span id="equipe" className={styles.anchor}></span>
        <SectionHeader>{t("QuiSommesNous.the_team", "L'équipe Réfugiés.info")}</SectionHeader>
        <Team />
      </TeamContainer>
      <ProblematicContainer className={styles.container}>
        <span id="problematic" className={styles.anchor}></span>
        <SectionHeader>{t("QuiSommesNous.issues", "Problématiques")}</SectionHeader>
        <Problematic />
      </ProblematicContainer>
      <ContributionContainer className={styles.container}>
        <span id="contribution" className={styles.anchor}></span>
        <SectionHeader>{t("QuiSommesNous.Approche contributive", "Approche contributive")}</SectionHeader>
        <Contribution />
      </ContributionContainer>
      <PartnersContainer className={styles.container}>
        <span id="partners" className={styles.anchor}></span>
        <SectionHeader>{t("QuiSommesNous.Partenaires", "Partenaires")}</SectionHeader>
        <Partners />
      </PartnersContainer>
    </MainContainer>
  );
};

export const getStaticProps = defaultStaticProps;

export default QuiSommesNous;
