import React, { Component } from "react";
import track from "react-tracking";
import { withTranslation } from "react-i18next";
import AnchorLink from "react-anchor-link-smooth-scroll";
import HeaderBackgroungImage from "../../assets/qui-sommes-nous/QuiSommesNous_header.svg";
import styled from "styled-components";

import { Mission } from "./components/Mission";
import { Problematic } from "./components/Problematic";
import { Contribution } from "./components/Contribution";
import { Team } from "./components/Team";
import { MemberDetails } from "./components/MemberDetails";
import { Partners } from "./components/Partners";

const MainContainer = styled.div`
  flex: 1;
  background: #ffffff;
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
  height: 64px;
  background: #f2f2f2;
  display: flex;
  flex-direction: center;
  justify-content: center;
  align-items: center;
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
`;

const SectionHeader = styled.div`
  text-align: center;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  margin-bottom: 48px;
`;

const MissionContainer = styled.div`
  height: 720px;
  padding-top: 48px;
`;
const TeamContainer = styled.div`
  height: 850px;
  background: #f2f2f2;
  padding-top: 48px;
  position: relative;
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
  height: 1020px;
  padding-top: 48px;
  padding-left: 120px;
  padding-right: 32px;
`;
class QuiSommesNous extends Component {
  state = {
    sideVisible: false,
    membre: {},
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onSelectMembre = (membre) =>
    this.setState({ sideVisible: true, membre: membre });

  closeSide = () => {
    if (this.state.sideVisible) {
      this.setState({ sideVisible: false });
    }
  };

  render() {
    const { membre, sideVisible } = this.state;
    const { t } = this.props;
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
        <NavBarContainer>
          <AnchorLink offset="60" href="#mission">
            <NavBarText>{t("QuiSommesNous.Missions", "Missions")}</NavBarText>
          </AnchorLink>
          <AnchorLink offset="60" href="#equipe">
            <NavBarText>{t("QuiSommesNous.Équipe", "Équipe")}</NavBarText>
          </AnchorLink>
          <AnchorLink offset="60" href="#problematic">
            <NavBarText>
              {t("QuiSommesNous.Problématiques", "Problématiques")}
            </NavBarText>
          </AnchorLink>
          <AnchorLink offset="60" href="#contribution">
            <NavBarText>
              {t(
                "QuiSommesNous.Approche contributive",
                "Approche contributive"
              )}
            </NavBarText>
          </AnchorLink>
          <AnchorLink offset="60" href="#partners">
            <NavBarText>
              {t("QuiSommesNous.Partenaires", "Partenaires")}
            </NavBarText>
          </AnchorLink>
        </NavBarContainer>
        <MissionContainer id="mission">
          <SectionHeader>
            {t("QuiSommesNous.Missions", "Missions")}
          </SectionHeader>
          <Mission t={t} />
        </MissionContainer>
        <TeamContainer id="equipe" onClick={this.closeSide}>
          <SectionHeader>{t("QuiSommesNous.Équipe", "Équipe")}</SectionHeader>
          <Team
            t={t}
            sideVisible={sideVisible}
            membre={membre}
            closeSide={this.closeSide}
            onMemberCardClick={this.onSelectMembre}
          />
          <MemberDetails isOpened={sideVisible} membreName={membre} />
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

export default track({
  page: "QuiSommesNous",
})(withTranslation()(QuiSommesNous));
