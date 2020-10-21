import React, { useState } from "react";
import styled from "styled-components";
import { Structure } from "../../../../../@types/interface";
import { activities } from "./data";
import _ from "lodash";
import { filtres } from "../../../../Dispositif/data";
import { jsUcfirst } from "../../../../../lib";
import { ActivityCard } from "../ActivityCard/ActivityCard";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";

const MainContainer = styled.div``;
const HelpContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: #2d9cdb;
  border-radius: 12px;
  width: 782px;
  margin-top: 16px;
  padding: 16px;
  margin-bottom: 16px;
  position: relative;
`;
const HelpHeader = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  width: 300px;
  color: #fbfbfb;
  margin-right: 16px;
`;

const HelpDescription = styled.div`
  line-height: 28px;
  color: #fbfbfb;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
`;
const TagActivity = styled.div`
  width: 782px;
  background: ${(props) => props.backgroundColor};
  border-radius: 12px;
  margin-bottom: 16px;
  color: ${(props) => props.color};
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  padding-bottom: 16px;
  padding-top: 16px;
  padding-left: 11px;
  padding-right: 11px;
`;
const ActivityCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
`;
interface Props {
  structure: Structure | null;
  setStructure: (arg: any) => void;
}

export const Step3 = (props: Props) => {
  const [showHelp, setShowHelp] = useState(true);
  const groupedActivities = _.groupBy(activities, (activity) => activity.tag);

  const getUpdatedActivities = (selectedActivity: string) => {
    if (!props.structure) return [];

    if (!props.structure.activities) return [selectedActivity];

    const removeActivity =
      props.structure.activities.filter(
        (activity) => activity === selectedActivity
      ).length > 0;

    if (removeActivity)
      return props.structure.activities.filter(
        (activity) => activity !== selectedActivity
      );

    return props.structure.activities.concat([selectedActivity]);
  };

  const selectActivity = (selectedActivity: string) => {
    props.setStructure({
      ...props.structure,
      activities: getUpdatedActivities(selectedActivity),
    });
  };

  return (
    <MainContainer>
      {showHelp ? (
        <HelpContainer>
          <IconContainer onClick={() => setShowHelp(false)}>
            <EVAIcon name="close" />
          </IconContainer>
          <HelpHeader>Comment ça marche ?</HelpHeader>
          <HelpDescription>
            <>
              Sélectionnez ci-dessous les activités que propose votre structure.
              Les internautes pourront ainsi comprendre rapidement votre offre
              de service. Cette liste n’est pas exhaustive et sera complétée
              avec le temps. <br />
              <b>
                Faites-nous part d’une activité manquante via notre livechat{" "}
              </b>
              présent en bas à droite de votre écran.
            </>
          </HelpDescription>
        </HelpContainer>
      ) : (
        <div style={{ marginTop: "24px" }} />
      )}
      {Object.keys(groupedActivities).map((activity) => {
        const correspondingTag = filtres.tags.filter(
          (tag) => tag.short === activity
        );

        const correspondingActivities = activities.filter(
          (activity2) => activity2.tag === activity
        );
        return (
          <TagActivity
            key={activity}
            backgroundColor={correspondingTag[0].lightColor}
            color={correspondingTag[0].darkColor}
          >
            <div style={{ marginLeft: "5px", marginBottom: "16px" }}>
              {jsUcfirst(correspondingTag[0].name)}
            </div>
            <ActivityCardsContainer>
              {correspondingActivities.map((detailedActivity) => (
                <ActivityCard
                  key={detailedActivity.activity}
                  activity={detailedActivity.activity}
                  darkColor={correspondingTag[0].darkColor}
                  lightColor={correspondingTag[0].lightColor}
                  selectActivity={selectActivity}
                  isSelected={
                    props.structure && props.structure.activities
                      ? props.structure.activities.includes(
                          detailedActivity.activity
                        )
                      : false
                  }
                  image={detailedActivity.image}
                />
              ))}
            </ActivityCardsContainer>
          </TagActivity>
        );
      })}
    </MainContainer>
  );
};
