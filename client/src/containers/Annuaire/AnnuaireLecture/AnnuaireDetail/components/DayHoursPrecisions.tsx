import React from "react";
import {
  OpeningHours,
  DetailedOpeningHours,
} from "../../../../../@types/interface";
import styled from "styled-components";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";

interface Props {
  day: string;
  openingHours: OpeningHours | undefined;
  t: any;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const Closed = (props: { day: string; t: any }) => (
  <Container>
    <div style={{ marginBottom: "2px" }}>
      <EVAIcon name="close-circle" fill="#F44336" className="mr-8" />
    </div>
    {props.t("Annuaire." + props.day, props.day) +
      " : " +
      props.t("Annuaire.fermé", "fermé")}
  </Container>
);

const format = (hours: string) => hours.replace(":", "h");

const getOpeningHours = (
  from0: string | undefined,
  to0: string | undefined,
  from1: string | undefined,
  to1: string | undefined,
  t: any
) => {
  if (!from0 || !to0) return " : " + t("Annuaire.ouvert", "ouvert");

  const firstPart =
    " " +
    t("Annuaire.de", "de") +
    " " +
    format(from0) +
    " " +
    t("Annuaire.à", "à") +
    " " +
    format(to0);

  if (!from1 || !to1) return firstPart;
  const secondPart =
    " " +
    t("Annuaire.et de", "et de") +
    " " +
    format(from1) +
    " " +
    t("Annuaire.à", "à") +
    " " +
    format(to1);
  return firstPart + secondPart;
};

const Opened = (props: {
  day: string;
  details: DetailedOpeningHours;
  t: any;
}) => {
  const { day, details, t } = props;
  return (
    <Container>
      <div style={{ marginBottom: "2px" }}>
        <EVAIcon name="checkmark-circle-2" fill="#4CAF50" className="mr-8" />
      </div>
      {t("Annuaire." + day, day) +
        getOpeningHours(
          details.from0,
          details.to0,
          details.from1,
          details.to1,
          t
        )}
    </Container>
  );
};

export const DayHoursPrecisions = (props: Props) => {
  const { day, openingHours } = props;

  if (!openingHours || !openingHours.details)
    return <Closed day={day} t={props.t} />;
  const dayOpeningHours = openingHours.details.filter(
    (detailedDay) => detailedDay.day === day
  );
  if (dayOpeningHours.length === 0) return <Closed day={day} t={props.t} />;

  return <Opened day={day} details={dayOpeningHours[0]} t={props.t} />;
};
