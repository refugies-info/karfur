import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import FButton from "components/FigmaUI/FButton/FButton";
import { assetsOnServer } from "assets/assetsOnServer";

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

export const Mission = () => (
  <MissionContentContainer>
    <MissionDispositif />
    <MissionDemarche />
    <MissionParcours />
  </MissionContentContainer>
);

const MissionDispositif = () => {
  const { t } = useTranslation();
  return (
    <MissionDetailContainer>
      <Image
        src={assetsOnServer.quiSommesNous.recenserDispositif}
        width={326}
        height={160}
        alt="recenser"
      />
      <MissionDetailTitle>
        {t(
          "QuiSommesNous.recenser",
          "Recenser les dispositifs d’accompagnement"
        )}
      </MissionDetailTitle>
      <MissionDetailDescription>
        {t(
          "QuiSommesNous.recenser-description",
          "De nombreux dispositifs émergent en France pour accueillir et accompagner les personnes réfugiées. Ces actions souffrent parfois d’un manque de visibilité et ne profitent pas au plus grand nombre. Réfugiés.info a pour mission de recenser, de rendre visible et de rendre accessible ces nombreuses initiatives."
        )}
      </MissionDetailDescription>
      <Link href="/advanced-search">
        <FButton type="fill-dark" tag="a">
          {t("Chercher un dispositif", "Explorer un dispositif")}
        </FButton>
      </Link>
    </MissionDetailContainer>
  )
}

const MissionDemarche = () => {
  const { t } = useTranslation();
  return (
    <MissionDetailContainer>
      <div>
        <Image
          src={assetsOnServer.quiSommesNous.vulgariserDemarche}
          width={326}
          height={160}
          alt="vulgariser"
        />
      </div>
      <MissionDetailTitle>
        {t(
          "QuiSommesNous.vulgariser",
          "Vulgariser et traduire les démarches administratives"
        )}
      </MissionDetailTitle>
      <MissionDetailDescription>
        {t(
          "QuiSommesNous.vulgariser-description",
          "Dès la protection internationale obtenue, les personnes réfugiées entrent dans le droit commun ce qui déclenche de nombreuses démarches administratives. Réfugiés.info publie des fiches pratiques pour vulgariser ces démarches et rassemble des bénévoles pour les traduire dans les principales langues de l'intégration."
        )}
      </MissionDetailDescription>
      <Link href="/advanced-search">
        <FButton type="fill-dark" tag="a">
          {t("Chercher une démarche", "Explorer les démarches")}
        </FButton>
      </Link>
    </MissionDetailContainer>
  )
}

const MissionParcours = () => {
  const { t } = useTranslation();
  return (
    <MissionDetailContainer>
      <Image
        src={assetsOnServer.quiSommesNous.parcours}
        width={326}
        height={160}
        alt="parcours"
      />
      <MissionDetailTitle>
        {t(
          "QuiSommesNous.parcours",
          "Créer des parcours personnalisés d’intégration"
        )}
      </MissionDetailTitle>
      <MissionDetailDescription>
        {t(
          "QuiSommesNous.parcours-description",
          "Obtenir l’asile, c’est surtout reconstruire. Un chez soi, un réseau, une vocation. Le déracinement a souvent brouillé les repères, les ambitions, les objectifs. Réfugiés.info propose un outil structurant l’action et permettant aux réfugiés d’atteindre plus vite et plus sereinement ses objectifs de vie."
        )}
      </MissionDetailDescription>
      <FooterText>
        {t(
          "QuiSommesNous.disponible prochainement",
          "Disponible prochainement"
        )}
      </FooterText>
    </MissionDetailContainer>
  )
}
