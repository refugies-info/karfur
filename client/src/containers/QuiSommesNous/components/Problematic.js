import React from "react";
import styled from "styled-components";
import { ReactComponent as AccompagnementImage } from "../../../assets/qui-sommes-nous/QuiSommesNous_accompagnement.svg";

const ProblematicContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 120px;
  padding-right: 120px;
  justify-content: space-between;
`;

const ProblematicDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  position: relative;
`;

const ProblematicDetailTitle = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 32px;
  margin-bottom: 24px;
`;

const TextContainer = styled.div`
  position: absolute;
  top: 210px;
`;

const ProblematicDetailDescription = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 32px;
`;

export const Problematic = (props) => (
  <ProblematicContentContainer>
    <Statut t={props.t} />
    <Information t={props.t} />
    <Accompagnement t={props.t} />
  </ProblematicContentContainer>
);

const Statut = (props) => (
  <ProblematicDetailContainer>
    <img
      src={
        "https://storage.googleapis.com/refugies-info-assets/qui-sommes-nous/QuiSommesNous_re%CC%81fugie%CC%81s.svg"
      }
    />
    <TextContainer>
      <ProblematicDetailTitle>
        {props.t(
          "QuiSommesNous.problem_1_header",
          "Comprendre le statut de réfugié"
        )}
      </ProblematicDetailTitle>
      <ProblematicDetailDescription>
        {props.t(
          "QuiSommesNous.problem_1_subheader",
          "Mieux comprendre c'est déjà mieux accueillir. Migrant, demandeur d'asile ou réfugié ne désignent pas les mêmes réalités. Réfugiés.info s'adresse particulièrement aux réfugiés, c'est-à-dire aux personnes à qui la France accorde une protection internationale car leur vie est menacée dans leur pays d’origine."
        )}
      </ProblematicDetailDescription>
    </TextContainer>
  </ProblematicDetailContainer>
);

const Information = (props) => (
  <ProblematicDetailContainer>
    <img
      src={
        "https://storage.googleapis.com/refugies-info-assets/qui-sommes-nous/plein_dinfos.svg"
      }
      alt="info"
    />
    <TextContainer>
      <ProblematicDetailTitle>
        {props.t(
          "QuiSommesNous.problem_2_header",
          "Une information cryptée, dispersée et périssable"
        )}
      </ProblematicDetailTitle>
      <ProblematicDetailDescription>
        {props.t(
          "QuiSommesNous.problem_2_subheader",
          "L’évolution rapide de la législation, le foisonnement de l’offre associative et la complexité de certaines démarches administratives rendent difficile la compréhension des droits et devoirs. Réfugiés.info centralise une information fiable, à jour et vulgarisée."
        )}
      </ProblematicDetailDescription>
    </TextContainer>
  </ProblematicDetailContainer>
);

const Accompagnement = (props) => (
  <ProblematicDetailContainer>
    <AccompagnementImage />
    <TextContainer>
      <ProblematicDetailTitle>
        {props.t(
          "QuiSommesNous.problem_3_header2",
          "Éviter les ruptures d’accompagnement"
        )}
      </ProblematicDetailTitle>
      <ProblematicDetailDescription>
        {props.t(
          "QuiSommesNous.problem_3_subheader2",
          "Déménagement, changement de projet de vie... À chaque nouvel interlocuteur, il faut souvent tout reprendre de zéro. Réfugiés.info envisage de proposer aux réfugiés de se créer un parcours personnel qu’ils peuvent partager facilement avec leurs aidants."
        )}
      </ProblematicDetailDescription>
    </TextContainer>
  </ProblematicDetailContainer>
);
