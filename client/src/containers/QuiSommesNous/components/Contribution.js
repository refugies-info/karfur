import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import "./Contribution.scss";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import { assetsOnServer } from "../../../assets/assetsOnServer";

const ContributionContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 120px;
  padding-right: 120px;
  justify-content: space-between;
`;

const ContributionDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  position: relative;
`;

const ContributionDetailTitle = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 32px;
  margin-bottom: 32px;
`;

const ContributionDetailDescription = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 32px;
`;

const TextContainer = styled.div`
  position: absolute;
  top: 210px;
`;
export const Contribution = (props) => (
  <ContributionContentContainer>
    <ContributionCode t={props.t} />
    <ContributionTerrain t={props.t} />
    <ContributionEngagement t={props.t} />
  </ContributionContentContainer>
);

const ContributionCode = (props) => (
  <ContributionDetailContainer>
    <img
      src={assetsOnServer.quiSommesNous.codeOuvert}
      alt="code ouvert"
      className="etat-ouvert-img"
    />
    <TextContainer>
      <ContributionDetailTitle>
        {props.t(
          "QuiSommesNous.contributive_1_header2",
          "Vers un État plus ouvert"
        )}
      </ContributionDetailTitle>
      <ContributionDetailDescription>
        {props.t(
          "QuiSommesNous.contributive_1_subheader",
          "Les valeurs d’ouverture et de transparence sont au coeur du projet Réfugiés.info : le code source du site est entièrement disponible. Un réseau ouvert participe à la conception et conseille l’équipe du projet sur les besoins et les fonctionnalités à développer"
        )}
      </ContributionDetailDescription>
      <a
        href="https://github.com/refugies-info/karfur"
        className="no-decoration"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FButton type="fill-dark">
          {props.t("QuiSommesNous.Voir le code source", "Voir le code source")}
        </FButton>
      </a>
    </TextContainer>
  </ContributionDetailContainer>
);

const ContributionTerrain = (props) => (
  <ContributionDetailContainer>
    <img
      src={assetsOnServer.quiSommesNous.terrain}
      alt="terrain"
      className="etat-ouvert-img"
    />
    <TextContainer>
      <ContributionDetailTitle>
        {props.t(
          "QuiSommesNous.contributive_2_header",
          "Le terrain aux commandes"
        )}
      </ContributionDetailTitle>
      <ContributionDetailDescription>
        {props.t(
          "QuiSommesNous.contributive_2_subheader",
          "Seuls les acteurs locaux sont capables de recenser efficacement les actions et de nourrir une base de connaissance commune. Ainsi Réfugiés.info permet à chaque territoire de recenser et de valoriser ses initiatives tout en découvrant de nouvelles"
        )}
      </ContributionDetailDescription>
      <FButton
        type="fill-dark"
        tag={"a"}
        href="https://avec.refugies.info"
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.t(
          "QuiSommesNous.réseau",
          "Rejoindre le réseau des contributeurs"
        )}
      </FButton>
    </TextContainer>
  </ContributionDetailContainer>
);

const ContributionEngagement = (props) => (
  <ContributionDetailContainer>
    <img
      src={assetsOnServer.quiSommesNous.microEngagement}
      alt="micro-engagement"
    />
    <TextContainer>
      <ContributionDetailTitle>
        {props.t(
          "QuiSommesNous.contributive_3_header",
          "Favoriser le micro-engagement"
        )}
      </ContributionDetailTitle>
      <ContributionDetailDescription>
        {props.t(
          "QuiSommesNous.contributive_3_subheader",
          "En donnant à chacun la possibilité d’être facilement acteur et contributeur de la plateforme, à l’instar de Wikipédia, Réfugiés.info favorise de nouvelles formes de micro-engagement permettant à de nouveaux publics de s’engager pour une cause de solidarité, en faveur des réfugiés"
        )}
      </ContributionDetailDescription>
      <FButton type="fill-dark" tag={NavLink} to="/backend/user-dash-contrib">
        {props.t("Contribuer", "Contribuer")}
      </FButton>
    </TextContainer>
  </ContributionDetailContainer>
);
