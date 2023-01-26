import React from "react";
import styled from "styled-components";
import Image from "next/image";
import styles from "../Sponsors.module.scss";
import { Structure } from "types/interface";

interface Props {
  index: number;
  totalNumberOfSponsor: number;
  sponsor: {
    type: string;
    object: Structure | undefined;
  };
  burl: string;
  isRTL: boolean;
}

const SectionTitle = styled.p`
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: #ffffff;
`;

const ImageLink = styled.a`
  background-color: white;
  width: 166px;
  height: 116px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  display: flex;
`;
const SponsorCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  margin-right: 16px;
  width: 214px;
  height: 303px;
  background: #eaeaea;
  border-radius: 12px;
`;

const SponsorTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: #212121;
  text-align: center;
`;

interface MainContainerProps {
  totalNumberOfSponsor: number;
  index: number;
  isRTL: boolean;
}
const MainContainer = styled.div`
  padding-right: ${(props: MainContainerProps) => (props.index === props.totalNumberOfSponsor - 1 ? "16px" : "0px")};
  padding-top: ${(props: MainContainerProps) => (props.index > 1 ? "45px" : "0px")};
  padding-left: ${(props: MainContainerProps) => (props.index === 1 ? "16px" : "0px")};
  display: flex;
  flex-direction: column;

  border-left: ${(props: MainContainerProps) =>
    props.index === 1 && !props.isRTL ? "2px solid rgb(255, 255, 255)" : null};
`;

export const SponsorSection = (props: Props) => {
  const structure = props.sponsor.object;
  return (
    <>
      {props.sponsor.type === "mainSponsor" ? (
        <MainContainer index={props.index} totalNumberOfSponsor={props.totalNumberOfSponsor} isRTL={props.isRTL}>
          <SectionTitle>Responsable</SectionTitle>
          {structure && (
            <SponsorCard>
              <ImageLink href={`${props.burl}annuaire/${structure._id}`} target="_blank" rel="noopener noreferrer">
                <Image
                  className={styles.sponsor_img}
                  src={structure.picture?.secure_url || ""}
                  alt={structure.nom}
                  width={160}
                  height={110}
                  style={{ objectFit: "contain" }}
                />
              </ImageLink>
              <SponsorTitle>{structure.nom}</SponsorTitle>
            </SponsorCard>
          )}
        </MainContainer>
      ) : structure && props.sponsor.type === "deduplicatedSponsors" ? (
        <MainContainer index={props.index} totalNumberOfSponsor={props.totalNumberOfSponsor} isRTL={props.isRTL}>
          {props.index === 1 && <SectionTitle>Partenaires</SectionTitle>}
          <SponsorCard>
            {structure.link && structure.picture && structure.picture.secure_url ? (
              <ImageLink
                href={((structure.link || "").includes("http") ? "" : "http://") + structure.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  className={styles.sponsor_img}
                  src={structure.picture.secure_url}
                  alt={structure.nom}
                  width={160}
                  height={110}
                  style={{ objectFit: "contain" }}
                />
              </ImageLink>
            ) : (
              <ImageLink>
                {structure.picture && structure.picture.secure_url && (
                  <Image
                    className={styles.sponsor_img}
                    src={structure.picture.secure_url}
                    alt={structure.nom}
                    width={160}
                    height={110}
                    style={{ objectFit: "contain" }}
                  />
                )}
              </ImageLink>
            )}
            <SponsorTitle>{structure.nom}</SponsorTitle>
          </SponsorCard>
        </MainContainer>
      ) : null}
    </>
  );
};
