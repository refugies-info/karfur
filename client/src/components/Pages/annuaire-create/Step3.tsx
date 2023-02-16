import React, { useState } from "react";
import styled from "styled-components";
import { jsUcfirst } from "lib";
import groupBy from "lodash/groupBy";
import { Structure } from "types/interface";
import { activities } from "data/activities";
import { ActivityCard } from "./ActivityCard";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { useSelector } from "react-redux";
import { themesSelector } from "services/Themes/themes.selectors";
import { colors } from "colors";
import { GetStructureResponse } from "api-types";

const MainContainer = styled.div``;
const HelpContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: #2d9cdb;
  border-radius: 12px;
  width: 740px;
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
interface TagActivityProps {
  backgroundColor: string;
  color: string;
}
const TagActivity = styled.div`
  width: 740px;
  background: ${(props: TagActivityProps) => props.backgroundColor};
  border-radius: 12px;
  margin-bottom: 16px;
  color: ${(props: TagActivityProps) => props.color};
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  padding-bottom: 16px;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
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
  structure: GetStructureResponse | null;
  setStructure: (arg: any) => void;
  setHasModifications: (arg: boolean) => void;
}

export const Step3 = (props: Props) => {
  const [showHelp, setShowHelp] = useState(true);
  const themes = useSelector(themesSelector);
  const groupedActivities = groupBy(activities, (activity) => activity.theme);

  const getUpdatedActivities = (selectedActivity: string) => {
    if (!props.structure) return [];

    if (!props.structure.activities) return [selectedActivity];

    const removeActivity = props.structure.activities.filter((activity) => activity === selectedActivity).length > 0;

    if (removeActivity) return props.structure.activities.filter((activity) => activity !== selectedActivity);

    return props.structure.activities.concat([selectedActivity]);
  };

  const selectActivity = (selectedActivity: string) => {
    props.setStructure({
      ...props.structure,
      activities: getUpdatedActivities(selectedActivity)
    });
    props.setHasModifications(true);
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
              Sélectionnez ci-dessous les activités que propose votre structure. Les internautes pourront ainsi
              comprendre rapidement votre offre de service. Cette liste n’est pas exhaustive et sera complétée avec le
              temps. <br />
              <b>Faites-nous part d’une activité manquante via notre livechat </b>
              présent en bas à droite de votre écran.
            </>
          </HelpDescription>
        </HelpContainer>
      ) : (
        <div style={{ marginTop: 24 }} />
      )}
      {Object.keys(groupedActivities).map((activity) => {
        const correspondingTheme = themes.find((theme) => theme.short.fr === activity);

        const correspondingActivities = activities.filter((activity2) => activity2.theme === activity);
        return (
          <TagActivity
            backgroundColor={correspondingTheme?.colors.color30 || colors.gray10}
            key={activity}
            color={correspondingTheme?.colors.color100 || colors.gray90}
          >
            <div style={{ marginLeft: "8px", marginBottom: "8px" }}>{jsUcfirst(correspondingTheme?.name.fr || "")}</div>
            <ActivityCardsContainer>
              {correspondingActivities.map((detailedActivity) => (
                <ActivityCard
                  key={detailedActivity.activity}
                  activity={detailedActivity.activity}
                  darkColor={correspondingTheme?.colors.color100 || colors.gray90}
                  lightColor={correspondingTheme?.colors.color30 || colors.gray10}
                  selectActivity={selectActivity}
                  isSelected={
                    props.structure && props.structure.activities
                      ? props.structure.activities.includes(detailedActivity.activity)
                      : false
                  }
                  image={detailedActivity.image}
                  isLectureMode={false}
                />
              ))}
            </ActivityCardsContainer>
          </TagActivity>
        );
      })}
    </MainContainer>
  );
};
