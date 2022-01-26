import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { assetsOnServer } from "assets/assetsOnServer";
import Image from "next/image";

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

export const Problematic = () => (
  <ProblematicContentContainer>
    <Statut />
    <Information />
    <Accompagnement />
  </ProblematicContentContainer>
);

const Statut = () => {
  const { t } = useTranslation();
  return (
    <ProblematicDetailContainer>
      <Image
        src={assetsOnServer.quiSommesNous.statutRefugie}
        alt="statut-refugie"
      />
      <TextContainer>
        <ProblematicDetailTitle>
          {t(
            "QuiSommesNous.problem_1_header",
            "Comprendre le statut de réfugié"
          )}
        </ProblematicDetailTitle>
        <ProblematicDetailDescription>
          {t(
            "QuiSommesNous.problem_1_subheader",
            "Mieux comprendre c'est déjà mieux accueillir. Migrant, demandeur d'asile ou réfugié ne désignent pas les mêmes réalités. Réfugiés.info s'adresse particulièrement aux réfugiés, c'est-à-dire aux personnes à qui la France accorde une protection internationale car leur vie est menacée dans leur pays d’origine."
          )}
        </ProblematicDetailDescription>
      </TextContainer>
    </ProblematicDetailContainer>
  )
}

const Information = () => {
  const { t } = useTranslation();
  return (
    <ProblematicDetailContainer>
      <Image src={assetsOnServer.quiSommesNous.information} alt="info" />
      <TextContainer>
        <ProblematicDetailTitle>
          {t(
            "QuiSommesNous.problem_2_header",
            "Une information cryptée, dispersée et périssable"
          )}
        </ProblematicDetailTitle>
        <ProblematicDetailDescription>
          {t(
            "QuiSommesNous.problem_2_subheader",
            "L’évolution rapide de la législation, le foisonnement de l’offre associative et la complexité de certaines démarches administratives rendent difficile la compréhension des droits et devoirs. Réfugiés.info centralise une information fiable, à jour et vulgarisée."
          )}
        </ProblematicDetailDescription>
      </TextContainer>
    </ProblematicDetailContainer>
  )
}

const Accompagnement = () => {
  const { t } = useTranslation();
  return (
    <ProblematicDetailContainer>
      <Image
        src={assetsOnServer.quiSommesNous.accompagnement}
        alt="accompagnement"
      />

      <TextContainer>
        <ProblematicDetailTitle>
          {t(
            "QuiSommesNous.problem_3_header2",
            "Éviter les ruptures d’accompagnement"
          )}
        </ProblematicDetailTitle>
        <ProblematicDetailDescription>
          {t(
            "QuiSommesNous.problem_3_subheader2",
            "Déménagement, changement de projet de vie... À chaque nouvel interlocuteur, il faut souvent tout reprendre de zéro. Réfugiés.info envisage de proposer aux réfugiés de se créer un parcours personnel qu’ils peuvent partager facilement avec leurs aidants."
          )}
        </ProblematicDetailDescription>
      </TextContainer>
    </ProblematicDetailContainer>
  )
}
