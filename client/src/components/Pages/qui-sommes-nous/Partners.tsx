import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import FButton from "components/UI/FButton/FButton";
import { partners } from "data/partners";
import Image from "next/image";
import { assetsOnServer } from "assets/assetsOnServer";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const DescriptionContainer = styled.div`
  font-size: 16px;
  line-height: 20px;
  width: 360px;
  margin-right: 60px;
`;
const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

const ImageContainer = styled.div`
  margin-right: 32px;
  margin-bottom: 32px;
  min-width: 160px;
  min-height: 100px;
  position: relative;
`;
const sortPartners = () =>
  partners.sort((a, b) => {
    if (a.date === b.date) return 0;
    if (a.date > b.date) return 1;
    return -1;
  });

export const Partners = () => {
  const sortedPartners = sortPartners();
  const { t } = useTranslation();

  return (
    <MainContainer>
      <DescriptionContainer>
        <b>
          {t(
            "QuiSommesNous.appel-a-manifestation1",
            "Ces organisations ont signé un Appel à manifestation d’intérêt et participent à l’évolution de la plateforme."
          )}
        </b>
        <br />
        <br />
        {t(
          "QuiSommesNous.appel-a-manifestation2",
          "Vous représentez une organisation liée à l’intégration des personnes réfugiées et souhaitez rejoindre l’aventure ? Téléchargez et renvoyez l’appel ci-dessous. Nous prendrons contact avec vous pour définir les modalités de notre partenariat."
        )}
        <div style={{ marginTop: "32px" }}>
          <a href={assetsOnServer.quiSommesNous.pdfAMI} download>
            <FButton type="fill-dark" name="download-outline">
              {t(
                "QuiSommesNous.telechargerAppel",
                "Télécharger l’appel [PDF] "
              )}
            </FButton>
          </a>
        </div>
      </DescriptionContainer>
      <LogoContainer>
        {sortedPartners.map((partner, i) =>
          partner.logo ? (
            <ImageContainer key={i}>
              <Image
                src={partner.logo}
                alt={partner.name}
                layout="fill"
                objectFit="contain"
              />
            </ImageContainer>
          ) : null
        )}
      </LogoContainer>
    </MainContainer>
  );
};
