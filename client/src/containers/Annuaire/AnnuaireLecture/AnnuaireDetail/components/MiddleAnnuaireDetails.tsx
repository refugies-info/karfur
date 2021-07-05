import React from "react";
import styled from "styled-components";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";
import { Structure } from "../../../../../types/interface";
import { DayHoursPrecisions } from "./DayHoursPrecisions";
import { ActivityCard } from "../../../AnnuaireCreate/components/ActivityCard/ActivityCard";
import { activities } from "../../../AnnuaireCreate/components/Step3/data";
import { filtres } from "../../../../Dispositif/data";
import { NoActivity } from "./NoActivity";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../../../../colors";
import FButton from "components/FigmaUI/FButton/FButton";

import { ObjectId } from "mongodb";

interface Props {
  structure: Structure | null;
  leftPartHeight: number;
  t: any;
  isLoading: boolean;
  userId: ObjectId | "";
  members: any | undefined;
}

const MiddleContainer = styled.div`
  padding: 32px;
  padding-top: 100px;
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
  color: ${colors.bleuCharte};
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
  flex-direction: column;
`;
const WhiteContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  width: fit-content;
  margin-bottom: 8px;
`;

// on firefox behaviour is strange with overflow, we have to add an empty container to have margin
const BottomContainer = styled.div`
  margin-top: 80px;
  width: 100%;
  height: 250px;
  color: #e5e5e5;
`;
const RedContainer = styled.div`
  background: ${colors.grey2};
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

const InfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
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

const InfoColumnContainer = styled.div`
  margin-right: 42px;
`;

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

const Departement = (props: { departement: string; t: any }) => (
  <WhiteContainer>
    <EVAIcon name="pin-outline" fill="#212121" className="mr-8" />
    {props.departement === "All"
      ? props.t("Dispositif.France entière", "France entière")
      : props.departement}
  </WhiteContainer>
);

const Placeholder = (props: {
  iconName: string;
  text: string;
  t: any;
  i18nKey: string;
}) => (
  <RedContainer>
    <EVAIcon name={props.iconName} fill="#212121" className="mr-8" />
    {props.t("Annuaire." + props.i18nKey, props.text)}
  </RedContainer>
);

const getActivityDetails = (activity: string) => {
  const correspondingActivity = activities.filter(
    (activityData) => activityData.activity === activity
  );

  if (!correspondingActivity) return { tag: null };
  const theme = correspondingActivity[0].tag;

  const correspondingTag = filtres.tags.filter((tag) => tag.short === theme);
  return { tag: correspondingTag[0], image: correspondingActivity[0].image };
};
export const MiddleAnnuaireDetail = (props: Props) => {
  const structure = props.structure;
  const isMember =
    props.members && props.members.find((el: any) => el._id === props.userId)
      ? true
      : false;
  if (!props.isLoading && structure) {
    return (
      <MiddleContainer height={props.leftPartHeight}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TitleContainer>
            {!structure.acronyme && <Title>{structure.nom}</Title>}
            {structure.acronyme && (
              <Title>
                {structure.nom}{" "}
                <span style={{ color: "#828282" }}>
                  {"- " + structure.acronyme}
                </span>{" "}
              </Title>
            )}
          </TitleContainer>
          {isMember && (
            <div style={{ height: "5Opx" }}>
              <FButton type="dark" name="edit-outline">
                Modifier la fiche
              </FButton>
            </div>
          )}
        </div>
        {structure.description && (
          <Description>{structure.description}</Description>
        )}
        {!structure.description && (
          <NoDescription>
            {props.t(
              "Annuaire.noDescription",
              "Aucune description de la structure disponible."
            )}
          </NoDescription>
        )}
        <InfoContainer>
          <InfoColumnContainer>
            <SubTitle>
              {props.t("Annuaire.Adresse email", "Adresse email")}
            </SubTitle>
            <LineContainer>
              {structure.mailsPublic &&
                structure.mailsPublic.map((mail) => (
                  <Mail mail={mail} key={mail} />
                ))}
              {(!structure.mailsPublic ||
                structure.mailsPublic.length === 0) && (
                <Placeholder
                  iconName="email-outline"
                  text="Aucune adresse email renseignée"
                  t={props.t}
                  i18nKey="noemail"
                />
              )}
            </LineContainer>
            <SubTitle>
              {props.t("Annuaire.Numéro de téléphone", "Numéro de téléphone")}
            </SubTitle>
            <LineContainer>
              {structure.phonesPublic &&
                structure.phonesPublic.map((phone) => (
                  <PhoneNumber phone={phone} key={phone} />
                ))}
              {(!structure.phonesPublic ||
                structure.phonesPublic.length === 0) && (
                <Placeholder
                  iconName="phone-call-outline"
                  text="Aucun numéro de téléphone renseigné"
                  t={props.t}
                  i18nKey="noPhone"
                />
              )}
            </LineContainer>
            <SubTitle>
              {props.t("Annuaire.Adresse postale", "Adresse postale")}
            </SubTitle>
            {structure.adressPublic && (
              <Adress adress={structure.adressPublic} />
            )}
            {!structure.adressPublic && (
              <Placeholder
                iconName="pin-outline"
                text="Aucune adresse postale renseignée"
                t={props.t}
                i18nKey="noAdress"
              />
            )}
            <SubTitle>
              {props.t(
                "Annuaire.Départements d'action",
                "Départements d'action"
              )}
            </SubTitle>
            <LineContainer>
              {structure.departments &&
                structure.departments.map((departement) => (
                  <Departement
                    key={departement}
                    departement={departement}
                    t={props.t}
                  />
                ))}
              {(!structure.departments ||
                structure.departments.length === 0) && (
                <Placeholder
                  iconName="hash"
                  text="Aucun département renseigné"
                  t={props.t}
                  i18nKey="noDepartement"
                />
              )}
            </LineContainer>
          </InfoColumnContainer>
          <InfoColumnContainer>
            <SubTitle>
              {props.t("Annuaire.Horaires d'accueil", "Horaires d'accueil")}
            </SubTitle>
            {!structure.openingHours && (
              <Placeholder
                iconName="alert-circle-outline"
                text="Horaires non-renseignées"
                i18nKey="noOpeningHours"
                t={props.t}
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
                  t={props.t}
                />
              ))}
          </InfoColumnContainer>
        </InfoContainer>
        <div style={{ marginTop: "24px", marginBottom: "24px" }}>
          <Title>
            {props.t("Annuaire.Activités et services", "Activités et services")}
          </Title>
        </div>
        <ActivityContainer>
          {structure.activities &&
            structure.activities.map((activity) => {
              const { tag, image } = getActivityDetails(activity);
              if (!tag) return;
              return (
                <ActivityCard
                  activity={props.t("Annuaire." + activity, activity)}
                  key={activity}
                  darkColor={tag.darkColor}
                  lightColor={tag.lightColor}
                  selectActivity={() => {}}
                  isSelected={true}
                  image={image}
                  isLectureMode={true}
                  t={props.t}
                  tag={tag}
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
        <BottomContainer>{"s"}</BottomContainer>
      </MiddleContainer>
    );
  }

  return (
    <MiddleContainer height={props.leftPartHeight}>
      <Skeleton width={600} height={40} />
      <div style={{ marginTop: "16px" }}>
        <Skeleton width={600} count={3} />
      </div>
      <div style={{ marginTop: "16px" }}>
        <Skeleton width={600} count={3} />
      </div>
    </MiddleContainer>
  );
};
