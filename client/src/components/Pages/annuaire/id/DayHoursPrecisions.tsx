import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  OpeningHours,
  DetailedOpeningHours,
} from "types/interface";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";

interface Props {
  day: string;
  openingHours: OpeningHours | undefined;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const Closed = (props: { day: string  }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <div style={{ marginBottom: "2px" }}>
        <EVAIcon name="close-circle" fill="#F44336" className="mr-8" />
      </div>
      {t("Annuaire." + props.day, props.day) +
        " : " + t("Annuaire.fermé", "fermé")}
    </Container>
  )
}

const format = (hours: string) => hours.replace(":", "h");

const getOpeningHours = (
  from0: string | undefined,
  to0: string | undefined,
  from1: string | undefined,
  to1: string | undefined,
) => {
  const { t } = useTranslation();

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
}) => {
  const { t } = useTranslation();
  const { day, details } = props;

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
        )}
    </Container>
  );
};

export const DayHoursPrecisions = (props: Props) => {
  const { day, openingHours } = props;

  if (!openingHours || !openingHours.details)
    return <Closed day={day} />;
  const dayOpeningHours = openingHours.details.filter(
    (detailedDay) => detailedDay.day === day
  );
  if (dayOpeningHours.length === 0) return <Closed day={day} />;

  return <Opened day={day} details={dayOpeningHours[0]} />;
};
