import React from "react";
import {
  OpeningHours,
  DetailedOpeningHours,
} from "../../../../../@types/interface";
import styled from "styled-components";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";

interface Props {
  day: string;
  openingHours: OpeningHours;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const Closed = (props: { day: string }) => (
  <Container>
    <div style={{ marginBottom: "2px" }}>
      <EVAIcon name="close-circle" fill="#F44336" className="mr-8" />
    </div>
    {props.day + " : fermé"}
  </Container>
);

const format = (hours: string) => hours.replace(":", "h");

const getOpeningHours = (
  from0: string | undefined,
  to0: string | undefined,
  from1: string | undefined,
  to1: string | undefined
) => {
  if (!from0 || !to0) return " : ouvert";

  const firstPart = " de " + format(from0) + " à " + format(to0);

  if (!from1 || !to1) return firstPart;
  const secondPart = " et de " + format(from1) + " à " + format(to1);
  return firstPart + secondPart;
};

const Opened = (props: { day: string; details: DetailedOpeningHours }) => {
  const { day, details } = props;
  return (
    <Container>
      <div style={{ marginBottom: "2px" }}>
        <EVAIcon name="checkmark-circle-2" fill="#4CAF50" className="mr-8" />
      </div>
      {day +
        getOpeningHours(details.from0, details.to0, details.from1, details.to1)}
    </Container>
  );
};

export const DayHoursPrecisions = (props: Props) => {
  const { day, openingHours } = props;

  if (!openingHours || !openingHours.details) return <Closed day={day} />;
  const dayOpeningHours = openingHours.details.filter(
    (detailedDay) => detailedDay.day === day
  );
  if (dayOpeningHours.length === 0) return <Closed day={day} />;

  return <Opened day={day} details={dayOpeningHours[0]} />;
};
