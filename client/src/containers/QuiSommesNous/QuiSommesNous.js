import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import AnchorLink from "react-anchor-link-smooth-scroll";
import styled from "styled-components";

import { Mission } from "./components/Mission";
import { Problematic } from "./components/Problematic";
import { Contribution } from "./components/Contribution";
import { Team } from "./components/Team";

import { Partners } from "./components/Partners";
import i18n from "../../i18n";
import { assetsOnServer } from "../../assets/assetsOnServer";

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
  font-weight: 500;
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
  font-weight: 700;
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
  font-weight: 700;
  font-size: 30px;
  line-height: 40px;
  margin-bottom: 48px;
`;

const SectionSubHeaderMissing = styled.div`
  text-align: center;
  font-weight: 700;
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
class QuiSommesNous extends Component {
  state = {
    sideVisible: false,
    membre: null,
    isToolbarVisible: true,
    visibleSection: null,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  onSelectMembre = (membre) => this.setState({ sideVisible: true, membre });

  closeSide = () => {
    if (this.state.sideVisible) {
      this.setState({ sideVisible: false });
    }
  };

  handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = currentScrollPos < 720;
    let visibleSection;
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
    this.setState({
      isToolbarVisible: visible,
      visibleSection,
    });
  };

  render() {
    const { membre, sideVisible } = this.state;
    const { t } = this.props;
    const isRTL = ["ar", "ps", "fa"].includes(i18n.language);

    return (
      <MainContainer>
        <HeaderContainer>
          <div style={{ marginTop: "240px", marginBottom: "28px" }}>
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
        <NavBarContainer isToolbarVisible={this.state.isToolbarVisible}>
          <AnchorLink offset="60" href="#mission">
            <NavBarText
              isVisibleSection={this.state.visibleSection === "Missions"}
            >
              {t("QuiSommesNous.Missions", "Missions")}
            </NavBarText>
          </AnchorLink>
          <AnchorLink offset="60" href="#equipe">
            <NavBarText
              isVisibleSection={this.state.visibleSection === "Equipe"}
            >
              {t("QuiSommesNous.Équipe", "Équipe")}
            </NavBarText>
          </AnchorLink>
          <AnchorLink offset="60" href="#problematic">
            <NavBarText
              isVisibleSection={this.state.visibleSection === "Problematiques"}
            >
              {t("QuiSommesNous.Problématiques", "Problématiques")}
            </NavBarText>
          </AnchorLink>
          <AnchorLink offset="60" href="#contribution">
            <NavBarText
              isVisibleSection={this.state.visibleSection === "Contribution"}
            >
              {t(
                "QuiSommesNous.Approche contributive",
                "Approche contributive"
              )}
            </NavBarText>
          </AnchorLink>
          <AnchorLink offset="60" href="#partners">
            <NavBarText
              isVisibleSection={this.state.visibleSection === "Partenaires"}
            >
              {t("QuiSommesNous.Partenaires", "Partenaires")}
            </NavBarText>
          </AnchorLink>
        </NavBarContainer>
        <MissionContainer id="mission">
          <SectionHeader>
            {t("QuiSommesNous.Missions", "Missions")}
          </SectionHeader>
          <Mission t={t} isRTL={isRTL} />
        </MissionContainer>
        <TeamContainer id="equipe" onClick={this.closeSide}>
          <SectionHeader>
            {t("QuiSommesNous.L'équipe", "L'équipe Réfugiés.info")}
          </SectionHeader>
          <Team
            t={t}
            sideVisible={sideVisible}
            membre={membre}
            closeSide={this.closeSide}
            onMemberCardClick={this.onSelectMembre}
            type="membres"
          />
          <SectionSubHeader>
            {t("QuiSommesNous.Anciens membres", "Anciens membres")}
            <SectionSubHeaderMissing>
              {t("QuiSommesNous.Vous nous manquez", "(vous nous manquez !)")}
            </SectionSubHeaderMissing>
          </SectionSubHeader>
          <Team
            t={t}
            sideVisible={sideVisible}
            membre={membre}
            closeSide={this.closeSide}
            onMemberCardClick={this.onSelectMembre}
            type="former_membres"
          />
        </TeamContainer>
        <ProblematicContainer id="problematic">
          <SectionHeader>
            {t("QuiSommesNous.Problématiques", "Problématiques")}
          </SectionHeader>
          <Problematic t={t} />
        </ProblematicContainer>
        <ContributionContainer id="contribution">
          <SectionHeader>
            {t("QuiSommesNous.Approche contributive", "Approche contributive")}
          </SectionHeader>
          <Contribution t={t} />
        </ContributionContainer>
        <PartnersContainer id="partners">
          <SectionHeader>
            {t("QuiSommesNous.Partenaires", "Partenaires")}
          </SectionHeader>
          <Partners t={t} />
        </PartnersContainer>
      </MainContainer>
    );
  }
}

export default withTranslation()(QuiSommesNous);
