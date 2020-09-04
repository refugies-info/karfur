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
import HeaderBackgroungImage from "../../assets/qui-sommes-nous/QuiSommesNous_header.svg";
import styled from "styled-components";

const MainContainer = styled.div`
  flex: 1;
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
      </MainContainer>
    );
  }
}

export default track({
  page: "QuiSommesNous",
})(withTranslation()(QuiSommesNous));
