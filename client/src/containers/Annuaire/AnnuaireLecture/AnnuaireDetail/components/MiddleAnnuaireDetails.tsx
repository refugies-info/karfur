import React from "react";
import styled from "styled-components";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";
import { Structure } from "../../../../../@types/interface";
import { DayHoursPrecisions } from "./DayHoursPrecisions";
import { ActivityCard } from "../../../AnnuaireCreate/components/ActivityCard/ActivityCard";
import { activities } from "../../../AnnuaireCreate/components/Step3/data";
import { filtres } from "../../../../Dispositif/data";
import { NoActivity } from "./NoActivity";

interface Props {
  structure: Structure;
  leftPartHeight: number;
}

const MiddleContainer = styled.div`
  padding: 32px;
  height: ${(props) => props.height}px;
  overflow: scroll;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
  margin-right: 8px;
`;

const TitleContainer = styled.div`
  margin-bottom: 14px;
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

const RedContainer = styled.div`
  background: #ffcecb;
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

const NoDescription = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #828282;
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

const ActivityContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  felx-direction: row;
`;
const PhoneNumber = (props: { phone: string }) => (
  <WhiteContainer>
    <EVAIcon name="phone-call-outline" fill="#212121" className="mr-8" />
    {props.phone}
  </WhiteContainer>
);

const Mail = (props: { mail: string }) => (
  <WhiteContainer>
    <EVAIcon name="email-outline" fill="#212121" className="mr-8" />
    {props.mail}
  </WhiteContainer>
);

const Adress = (props: { adress: string | undefined }) => (
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

const Departement = (props: { departement: string }) => (
  <WhiteContainer>
    <EVAIcon name="pin-outline" fill="#212121" className="mr-8" />
    {props.departement}
  </WhiteContainer>
);

const Placeholder = (props: { iconName: string; text: string }) => (
  <RedContainer>
    <EVAIcon name={props.iconName} fill="#212121" className="mr-8" />
    {props.text}
  </RedContainer>
);

const getActivityDetails = (activity: string) => {
  const correspondingActivity = activities.filter(
    (activityData) => activityData.activity === activity
  );

  if (!correspondingActivity) return null;
  const theme = correspondingActivity[0].tag;

  const correspondingTag = filtres.tags.filter((tag) => tag.short === theme);
  return {
    darkColor: correspondingTag[0].darkColor,
    lightColor: correspondingTag[0].lightColor,
    image: correspondingActivity[0].image,
  };
};
export const MiddleAnnuaireDetail = (props: Props) => {
  const structure = props.structure;
  return (
    <MiddleContainer height={props.leftPartHeight}>
      <TitleContainer>
        {!structure.acronyme && <Title>{structure.nom}</Title>}
        {structure.acronyme && (
          <Title>
            {structure.nom}{" "}
            <span style={{ color: "#828282" }}>
              {" (" + structure.acronyme + ")"}
            </span>{" "}
          </Title>
        )}
      </TitleContainer>
      <SubTitle>Adresse email</SubTitle>
      <LineContainer>
        {structure.mailsPublic &&
          structure.mailsPublic.map((mail) => <Mail mail={mail} key={mail} />)}
        {(!structure.mailsPublic || structure.mailsPublic.length === 0) && (
          <Placeholder
            iconName="email-outline"
            text="Aucune adresse email renseignée"
          />
        )}
      </LineContainer>
      <SubTitle>Numéro de téléphone</SubTitle>
      <LineContainer>
        {structure.phonesPublic &&
          structure.phonesPublic.map((phone) => (
            <PhoneNumber phone={phone} key={phone} />
          ))}
        {(!structure.phonesPublic || structure.phonesPublic.length === 0) && (
          <Placeholder
            iconName="phone-call-outline"
            text="Aucun numéro de téléphone renseigné"
          />
        )}
      </LineContainer>
      <SubTitle>Adresse postale</SubTitle>
      {structure.adressPublic && <Adress adress={structure.adressPublic} />}
      {!structure.adressPublic && (
        <Placeholder
          iconName="pin-outline"
          text="Aucune adresse postale renseignée"
        />
      )}
      <SubTitle>Horaires d'accueil</SubTitle>
      {!structure.openingHours && (
        <Placeholder
          iconName="alert-circle-outline"
          text="Horaires non-renseignées"
        />
      )}
      {structure.openingHours && structure.openingHours.precisions && (
        <div style={{ marginBottom: "8px" }}>
          <HoursPrecisions text={structure.openingHours.precisions} />
        </div>
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
      <SubTitle>Départements d'action</SubTitle>
      <LineContainer>
        {structure.departments &&
          structure.departments.map((departement) => (
            <Departement key={departement} departement={departement} />
          ))}
        {(!structure.departments || structure.departments.length === 0) && (
          <Placeholder iconName="hash" text="Aucun département renseigné" />
        )}
      </LineContainer>
      <div style={{ marginTop: "24px", marginBottom: "24px" }}>
        <Title>A propos</Title>
      </div>
      {structure.description && (
        <Description>{structure.description}</Description>
      )}
      {!structure.description && (
        <NoDescription>
          Aucune description de la structure disponible.
        </NoDescription>
      )}
      <div style={{ marginTop: "24px", marginBottom: "24px" }}>
        <Title>Activités</Title>
      </div>
      <ActivityContainer>
        {structure.activities &&
          structure.activities.map((activity) => {
            const detailedActivity = getActivityDetails(activity);
            if (!detailedActivity) return;
            return (
              <ActivityCard
                activity={activity}
                key={activity}
                darkColor={detailedActivity.darkColor}
                lightColor={detailedActivity.lightColor}
                selectActivity={() => {}}
                isSelected={true}
                image={detailedActivity.image}
                isLectureMode={true}
              />
            );
          })}
        {(!structure.activities || structure.activities.length === 0) && (
          <>
            <NoActivity />
            <NoActivity />
            <NoActivity />
          </>
        )}
      </ActivityContainer>
    </MiddleContainer>
  );
};
