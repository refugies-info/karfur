import React from "react";
import { useTranslation } from "next-i18next";
import { DetailedOpeningHours, OpeningHours } from "@refugies-info/api-types";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./DayHoursPrecisions.module.scss";

interface Props {
  day: string;
  openingHours: OpeningHours | undefined;
}

const Closed = (props: { day: string }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: "2px" }}>
        <EVAIcon name="close-circle" fill="#F44336" className="me-2" />
      </div>
      {/* @ts-ignore */}
      {t("Annuaire." + props.day, props.day) + " : " + t("Annuaire.closed", "fermé")}
    </div>
  );
};

const format = (hours: string) => hours.replace(":", "h");

const getOpeningHours = (
  from0: string | undefined,
  to0: string | undefined,
  from1: string | undefined,
  to1: string | undefined,
  t: any,
) => {
  if (!from0 || !to0) return " : " + t("Annuaire.ouvert", "ouvert");

  const firstPart = " " + t("Annuaire.de", "de") + " " + format(from0) + " " + t("Annuaire.a", "à") + " " + format(to0);

  if (!from1 || !to1) return firstPart;
  const secondPart =
    " " + t("Annuaire.et de", "et de") + " " + format(from1) + " " + t("Annuaire.a", "à") + " " + format(to1);
  return firstPart + secondPart;
};

const Opened = (props: { day: string; details: DetailedOpeningHours }) => {
  const { t } = useTranslation();
  const { day, details } = props;

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: "2px" }}>
        <EVAIcon name="checkmark-circle-2" fill="#4CAF50" className="me-2" />
      </div>
      {/* @ts-ignore */}
      {t("Annuaire." + day, day) + getOpeningHours(details.from0, details.to0, details.from1, details.to1, t)}
    </div>
  );
};

export const DayHoursPrecisions = (props: Props) => {
  const { day, openingHours } = props;

  if (!openingHours || !openingHours.details) return <Closed day={day} />;
  const dayOpeningHours = openingHours.details.filter((detailedDay) => detailedDay.day === day);
  if (dayOpeningHours.length === 0) return <Closed day={day} />;

  return <Opened day={day} details={dayOpeningHours[0]} />;
};
