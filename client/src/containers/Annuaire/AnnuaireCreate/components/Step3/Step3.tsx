import React, { useState } from "react";
import styled from "styled-components";
import { Structure } from "../../../../../@types/interface";
import { activities } from "./data";
import _ from "lodash";
import { filtres } from "../../../../Dispositif/data";
import { jsUcfirst } from "../../../../../lib";
import { ActivityCard } from "../ActivityCard/ActivityCard";

const MainContainer = styled.div``;
const HelpContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: #2d9cdb;
  border-radius: 12px;
  width: 800px;
  height: 136px;
  margin-top: 24px;
  padding: 16px;
  margin-bottom: 24px;
`;
const HelpHeader = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  width: 100px;
  color: #fbfbfb;
  align-items: flex-wrap;
  margin-right: 40px;
`;

const HelpDescription = styled.div`
  line-height: 28px;
  color: #fbfbfb;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
`;
const TagActivity = styled.div`
  width: 800px;
  background: ${(props) => props.backgroundColor};
  border-radius: 12px;
  margin-bottom: 24px;
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
interface Props {
  structure: Structure | null;
  setStructure: (arg: any) => void;
}

export const Step3 = (props: Props) => {
  const groupedActivities = _.groupBy(activities, (activity) => activity.tag);
  console.log("test");
  return (
    <MainContainer>
      <HelpContainer>
        <HelpHeader>Comment ça marche ?</HelpHeader>
        <HelpDescription>
          <>
            Choisissez les <b> thèmes </b> correspondant à votre structure puis
            précisez quelles <b> activités </b> vous proposez au sein des thèmes
            choisis.
            <br />
            L’utilisateur pourra ainsi connaître et reconnaître les activités
            liées à l’intégration des personnes réfugiés.
          </>
        </HelpDescription>
      </HelpContainer>
      {Object.keys(groupedActivities).map((activity) => {
        const correspondingTag = filtres.tags.filter(
          (tag) => tag.short === activity
        );

        const correspondingActivities = activities.filter(
          (activity2) => activity2.tag === activity
        );
        console.log("corres", correspondingActivities);
        return (
          <TagActivity
            backgroundColor={correspondingTag[0].lightColor}
            color={correspondingTag[0].darkColor}
          >
            <div style={{ marginLeft: "5px", marginBottom: "16px" }}>
              {jsUcfirst(correspondingTag[0].name)}
            </div>
            <ActivityCardsContainer>
              {correspondingActivities.map((detailedActivity) => (
                <ActivityCard activity={detailedActivity.activity} />
              ))}
            </ActivityCardsContainer>
          </TagActivity>
        );
      })}
    </MainContainer>
  );
};
