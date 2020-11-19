import React from "react";
import styled from "styled-components";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";
import { Structure } from "../../../../../@types/interface";
import { DayHoursPrecisions } from "./DayHoursPrecisions";
interface Props {
  structure: Structure;
}

const MiddleContainer = styled.div`
  padding: 32px;
  height: 675px;
  overflow: scroll;
  width: 100%;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  margin-right: 8px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-bottom: 14px;
`;

const Acronyme = styled.div`
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
`;

const SubTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin-top: 24px;
  margin-bottom: 8px;
`;
const LineContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const WhiteContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  width: fit-content;
  margin-right: 8px;
`;

const BlueContainer = styled.div`
  background: #d2edfc;
  border-radius: 12px;
  padding: 16px;
  width: fit-content;
`;

const Description = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
`;
const weekDays = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
const PhoneNumber = (props: { phone: string }) => (
  <WhiteContainer>
    <EVAIcon name="phone-call-outline" fill="#212121" className="mr-8" />
    {props.phone}
  </WhiteContainer>
);

const Adress = (props: { adress: string }) => (
  <WhiteContainer>
    <EVAIcon name="pin-outline" fill="#212121" className="mr-8" />
    {props.adress}
  </WhiteContainer>
);

const HoursPrecisions = (props: { text: string }) => (
  <BlueContainer>
    <EVAIcon name="info" fill="#2D9CDB" className="mr-8" />
    {props.text}
  </BlueContainer>
);

export const MiddleAnnuaireDetail = (props: Props) => {
  const structure = props.structure;
  return (
    <MiddleContainer>
      <TitleContainer>
        <Title>{structure.nom}</Title>
        {structure.acronyme && (
          <Acronyme>{"(" + structure.acronyme + ")"}</Acronyme>
        )}
      </TitleContainer>
      <SubTitle>Numéro de téléphone</SubTitle>
      <LineContainer>
        {structure.phonesPublic.map((phone) => (
          <PhoneNumber phone={phone} key={phone} />
        ))}
      </LineContainer>
      <SubTitle>Adresse postale</SubTitle>
      <Adress adress={structure.adressPublic} />
      <SubTitle>Horaires d'accueil</SubTitle>
      {structure.openingHours && structure.openingHours.precisions && (
        <HoursPrecisions text={structure.openingHours.precisions} />
      )}
      {structure.openingHours && structure.openingHours.noPublic && (
        <HoursPrecisions text={"Nous ne recevons pas de public"} />
      )}
      {structure.openingHours &&
        !structure.openingHours.noPublic &&
        weekDays.map((day) => (
          <DayHoursPrecisions
            day={day}
            openingHours={structure.openingHours}
            key={day}
          />
        ))}
      <div style={{ marginTop: "24px", marginBottom: "24px" }}>
        <Title>A propos</Title>
      </div>
      <Description>{structure.description}</Description>
    </MiddleContainer>
  );
};
