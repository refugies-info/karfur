import React from "react";
import styled from "styled-components";
import { ReactComponent as DispoImage } from "../../../assets/qui-sommes-nous/QuiSommesNous_dispositif.svg";
import DemarcheImage from "../../../assets/qui-sommes-nous/demarche_light.svg";

import { ReactComponent as ParcoursImage } from "../../../assets/qui-sommes-nous/QuiSommesNous_parcours.svg";
import { NavLink } from "react-router-dom";

import FButton from "../../../components/FigmaUI/FButton/FButton";
import "./Mission.scss";

const MissionContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 120px;
  padding-right: 120px;
  justify-content: space-between;
`;

const MissionDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
`;

const MissionDetailTitle = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 32px;
  margin-bottom: 32px;
`;

const MissionDetailDescription = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 32px;
`;

const FooterText = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-top: 24px;
`;

export const Mission = (props) => (
  <MissionContentContainer>
    <MissionDispositif t={props.t} />
    <MissionDemarche t={props.t} />
    <MissionParcours t={props.t} />
  </MissionContentContainer>
);

const MissionDispositif = (props) => (
  <MissionDetailContainer>
    <DispoImage />
    <MissionDetailTitle>
      {props.t(
        "QuiSommesNous.recenser",
        "Recenser les dispositifs d’accompagnement"
      )}
    </MissionDetailTitle>
    <MissionDetailDescription>
      {props.t(
        "QuiSommesNous.recenser-description",
        "De nombreux dispositifs émergent en France pour accueillir et accompagner les personnes réfugiées. Ces actions souffrent parfois d’un manque de visibilité et ne profitent pas au plus grand nombre. Réfugiés.info a pour mission de recenser, de rendre visible et de rendre accessible ces nombreuses initiatives."
      )}
    </MissionDetailDescription>
    <FButton type="fill-dark" tag={NavLink} to="/advanced-search">
      {props.t("Chercher un dispositif", "Explorer un dispositif")}
    </FButton>
  </MissionDetailContainer>
);

const MissionDemarche = (props) => (
  <MissionDetailContainer>
    {/* <DemarcheImage /> */}
    <div>
      <img src={DemarcheImage} className={"demarche-img"} />
    </div>
    <MissionDetailTitle>
      {props.t(
        "QuiSommesNous.vulgariser",
        "Vulgariser et traduire les démarches administratives"
      )}
    </MissionDetailTitle>
    <MissionDetailDescription>
      {props.t(
        "QuiSommesNous.vulgariser-description",
        "Dès la protection internationale obtenue, les personnes réfugiées entrent dans le droit commun ce qui déclenche de nombreuses démarches administratives. Réfugiés.info publie des fiches pratiques pour vulgariser ces démarches et rassemble des bénévoles pour les traduire dans les principales langues de l'intégration."
      )}
    </MissionDetailDescription>
    <FButton type="fill-dark" tag={NavLink} to="/advanced-search">
      {props.t("Chercher une démarche", "Explorer les démarches")}
    </FButton>
  </MissionDetailContainer>
);

const MissionParcours = (props) => (
  <MissionDetailContainer>
    <ParcoursImage />
    <MissionDetailTitle>
      {props.t(
        "QuiSommesNous.parcours",
        "Créer des parcours personnalisés d’intégration"
      )}
    </MissionDetailTitle>
    <MissionDetailDescription>
      {props.t(
        "QuiSommesNous.parcours-description",
        "Obtenir l’asile, c’est surtout reconstruire. Un chez soi, un réseau, une vocation. Le déracinement a souvent brouillé les repères, les ambitions, les objectifs. Réfugiés.info propose un outil structurant l’action et permettant aux réfugiés d’atteindre plus vite et plus sereinement ses objectifs de vie."
      )}
    </MissionDetailDescription>
    <FooterText>
      {props.t(
        "QuiSommesNous.disponible prochainement",
        "Disponible prochainement"
      )}
    </FooterText>
  </MissionDetailContainer>
);
