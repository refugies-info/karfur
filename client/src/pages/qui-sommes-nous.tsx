import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import i18n from "i18n";
import { Mission } from "components/Pages/qui-sommes-nous/Mission";
import { Problematic } from "components/Pages/qui-sommes-nous/Problematic";
import { Contribution } from "components/Pages/qui-sommes-nous/Contribution";
import { Team } from "components/Pages/qui-sommes-nous/Team";
import { Partners } from "components/Pages/qui-sommes-nous/Partners";
import { assetsOnServer } from "assets/assetsOnServer";
import type { Member } from "data/members";
import SEO from "components/Seo";

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

const HeaderText = styled.div`
  font-weight: bold;
  font-size: 52px;
  line-height: 66px;
`;
const SubHeaderText = styled.div`
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
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
  height: 64px;
  background: #f2f2f2;
  display: flex;
  flex-direction: center;
  justify-content: center;
  align-items: center;
  z-index: 1;
  top: ${(props) =>
    !props.isToolbarVisible ? "0px !important" : "0px !important"};
`;

const NavBarText = styled.div`
  font-size: 16px;
  line-height: 20px;
  padding: 22px;
  height: 100%;
  &:hover {
    background: #212121;
    color: #f2f2f2;
  }

  background: ${(props) => (props.isVisibleSection ? "#212121" : "#f2f2f2")};
  color: ${(props) => (props.isVisibleSection ? "#f2f2f2" : "#212121")};
`;

const SectionHeader = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 40px;
  line-height: 40px;
  margin-bottom: 48px;
`;
const SectionSubHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: baseline;
  text-align: center;
  font-weight: bold;
  font-size: 30px;
  line-height: 40px;
  margin-bottom: 48px;
`;

const SectionSubHeaderMissing = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  color: grey;
  margin-left: 8px;
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

const QuiSommesNous = () => {
  const [sideVisible, setSideVisible] = useState(false);
  const [membre, setMembre] = useState<Member | null>(null);
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

  const onSelectMembre = (membre: any) => {
    setSideVisible(true);
    setMembre(membre);
  };

  const closeSide = () => {
    if (sideVisible) setSideVisible(false);
  };

  return (
    <MainContainer>
      <SEO />
      <HeaderContainer>
        <div style={{ marginTop: 240, marginBottom: 28 }}>
          <HeaderTextContainer>
            <HeaderText>
              {t("QuiSommesNous.Qui sommes-nous", "Qui sommes nous ?")}
            </HeaderText>
          </HeaderTextContainer>
        </div>
        <HeaderTextContainer>
          <SubHeaderText>
            {t(
              "QuiSommesNous.subheader1",
              "Réfugiés.info est un projet collaboratif"
            )}
          </SubHeaderText>
        </HeaderTextContainer>
        <HeaderTextContainer>
          <SubHeaderText>
            {t(
              "QuiSommesNous.subheader2",
              "porté par la Diair et développé par la Mednum"
            )}
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
          <NavBarText isVisibleSection={visibleSection === "Equipe"}>
            {t("QuiSommesNous.Équipe", "Équipe")}
          </NavBarText>
        </a>
        <a href="#problematic">
          <NavBarText isVisibleSection={visibleSection === "Problematiques"}>
            {t("QuiSommesNous.Problématiques", "Problématiques")}
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
      <MissionContainer id="mission">
        <SectionHeader>{t("QuiSommesNous.Missions", "Missions")}</SectionHeader>
        <Mission />
      </MissionContainer>
      <TeamContainer id="equipe" onClick={closeSide}>
        <SectionHeader>
          {t("QuiSommesNous.L'équipe", "L'équipe Réfugiés.info")}
        </SectionHeader>
        <Team
          sideVisible={sideVisible}
          member={membre}
          onMemberCardClick={onSelectMembre}
          type="members"
        />
        <SectionSubHeader>
          {t("QuiSommesNous.Anciens membres", "Anciens membres")}
          <SectionSubHeaderMissing>
            {t("QuiSommesNous.Vous nous manquez", "(vous nous manquez !)")}
          </SectionSubHeaderMissing>
        </SectionSubHeader>
        <Team
          sideVisible={sideVisible}
          member={membre}
          onMemberCardClick={onSelectMembre}
          type="former_members"
        />
      </TeamContainer>
      <ProblematicContainer id="problematic">
        <SectionHeader>
          {t("QuiSommesNous.Problématiques", "Problématiques")}
        </SectionHeader>
        <Problematic />
      </ProblematicContainer>
      <ContributionContainer id="contribution">
        <SectionHeader>
          {t("QuiSommesNous.Approche contributive", "Approche contributive")}
        </SectionHeader>
        <Contribution />
      </ContributionContainer>
      <PartnersContainer id="partners">
        <SectionHeader>
          {t("QuiSommesNous.Partenaires", "Partenaires")}
        </SectionHeader>
        <Partners />
      </PartnersContainer>
    </MainContainer>
  );
};

export default QuiSommesNous;
