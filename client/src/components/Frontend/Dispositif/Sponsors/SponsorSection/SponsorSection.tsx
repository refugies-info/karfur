import React from "react";
import styled from "styled-components";

interface Props {
  sponsor: {
    type: string;
    object: {
      _id?: string;
      picture?: any;
      nom: string;
      acronyme?: string;
      link?: string;
      alt?: string;
    };
  };
  burl: string;
}

const SectionTitle = styled.p`
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
  margin-right: 30px;
  width: 214px;
  height: 303px;
  background: #eaeaea;
  border-radius: 12px;
`;

const SponsorTitle = styled.p`
  font-weight: bold;
  font-size: 18px;
  color: #212121;
  text-align: center;
`;

const MainContainer = styled.p`
  display: flex;
  flex-direction: column;
`;

export const SponsorSection = (props: Props) => {
  return (
    <>
      {props.sponsor.type === "mainSponsor" ? (
        <MainContainer>
          <SectionTitle>Responsable</SectionTitle>
          <SponsorCard>
            <ImageLink
              href={`${props.burl}annuaire/${props.sponsor.object._id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="sponsor-img"
                src={(props.sponsor.object.picture || {}).secure_url}
                alt={props.sponsor.object.acronyme}
              />
            </ImageLink>
            <SponsorTitle>{props.sponsor.object.nom}</SponsorTitle>
          </SponsorCard>
        </MainContainer>
      ) : props.sponsor.type === "deduplicatedSponsors" ? (
        <MainContainer>
          <SectionTitle>Partenaires</SectionTitle>
          <SponsorCard>
            {props.sponsor.object.link &&
            props.sponsor.object.picture &&
            props.sponsor.object.picture.secure_url ? (
              <ImageLink
                href={
                  ((props.sponsor.object.link || "").includes("http")
                    ? ""
                    : "http://") + props.sponsor.object.link
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="sponsor-img"
                  src={props.sponsor.object.picture.secure_url}
                  alt={props.sponsor.object.alt}
                />
              </ImageLink>
            ) : (
              <ImageLink>
                {props.sponsor.object.picture &&
                  props.sponsor.object.picture.secure_url && (
                    <img
                      className="sponsor-img"
                      src={props.sponsor.object.picture.secure_url}
                      alt={props.sponsor.object.alt}
                    />
                  )}
              </ImageLink>
            )}
            <SponsorTitle>{props.sponsor.object.nom}</SponsorTitle>
          </SponsorCard>
        </MainContainer>
      ) : null}
    </>
  );
};
