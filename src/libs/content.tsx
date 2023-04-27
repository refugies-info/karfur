import React from "react";
import { conditionType, Metadatas } from "@refugies-info/api-types";
import { TextSmallNormal } from "../components/StyledText";

import imgOfpra from "../theme/images/demarche/acte_naissance_OFPRA.png";
import imgTse from "../theme/images/demarche/titreSejour.png";
import imgOfii from "../theme/images/demarche/ofii.png";
import imgCb from "../theme/images/demarche/carteBancaire.png";
import imgPoleEmploi from "../theme/images/demarche/poleEmploi.png";
import imgDriver from "../theme/images/demarche/permisConduire.png";

/**
 * A1.1, A1, A2, B1, B2, C1, C2
 */
const ALL_FRENCH_LEVELS = 7;

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getConditionImage = (condition: conditionType) => {
  switch (condition) {
    case "acte naissance":
      return imgOfpra;
    case "titre sejour":
      return imgTse;
    case "cir":
      return imgOfii;
    case "bank account":
      return imgCb;
    case "pole emploi":
      return imgPoleEmploi;
    case "driver license":
      return imgDriver;
    default:
      return null;
  }
};

const getAge = (data: Metadatas["age"], t: any) => {
  if (data === null) t("content_screen.irrelevant");
  if (!data) return t("content_screen.all_ages");
  if (data.type === "moreThan") {
    const result =
      t("content_screen.more_than", "Plus de") +
      " " +
      data.ages[0] +
      " " +
      t("content_screen.years", "ans");

    return result;
  }

  if (data.type === "lessThan") {
    const result =
      t("content_screen.less_than", "Moins de") +
      " " +
      data.ages[0] +
      " " +
      t("content_screen.years", "ans");

    return result;
  }

  if (data.type === "between") {
    const result =
      t("content_screen.from", "De") +
      " " +
      data.ages[0] +
      " " +
      t("content_screen.to", "à") +
      " " +
      data.ages[1] +
      " " +
      t("content_screen.years", "ans");

    return result;
  }
};

const getLocation = (data: Metadatas["location"], t: any) => {
  if (!data) return "";
  if (data === "online") {
    return t("content_screen.online", "En ligne");
  }
  if (data === "france" || data.includes("All")) {
    return t("content_screen.whole_country", "Toute la France");
  }

  return data
    .map((dep: string) => {
      const [nbDep, nomDep] = dep.split(" - ");
      return `${nomDep} (${nbDep})`;
    })
    .join("\n");
};

const getCommitment = (
  commitment: Metadatas["commitment"] | null | undefined,
  t: any
) => {
  if (!commitment) return commitment;
  if (commitment.amountDetails === "between" && commitment.hours.length >= 2) {
    return capitalizeFirstLetter(
      t("Infocards.commitmentBetween", {
        min: commitment.hours[0],
        max: commitment.hours[1],
        unit: t(`Infocards.${commitment.timeUnit}`),
      })
    );
  }

  return capitalizeFirstLetter(
    `${t(`Infocards.${commitment.amountDetails}`)} ${commitment.hours[0]} ${t(
      `Infocards.${commitment.timeUnit}`
    )}`
  );
  // return `${t(`Infocards.${commitment.amountDetails}`)} ${commitment.hours} ${t(
  //   `Infocards.${commitment.timeUnit}`
  // )}`;
};
const getFrequency = (
  frequency: Metadatas["frequency"] | null | undefined,
  t: any
) => {
  if (!frequency) return frequency;
  return capitalizeFirstLetter(
    `${t(`Infocards.${frequency.amountDetails}`)} ${frequency.hours} ${t(
      `Infocards.${frequency.timeUnit}`
    )} ${t(`Infocards.${frequency.frequencyUnit}`)}`
  );
};
const getTimeSlots = (
  timeSlots: Metadatas["timeSlots"] | null | undefined,
  t: any
) => {
  if (!timeSlots) return timeSlots;
  return timeSlots.map((slot) => t(`Infocards.${slot}`)).join(", ");
};

export const getDescriptionNew = (
  metadatas: Metadatas,
  key: keyof Metadatas,
  t: any
) => {
  switch (key) {
    case "publicStatus":
      if (!metadatas.publicStatus || metadatas.publicStatus.length === 0) {
        return [
          t("content_screen.status_refugie"),
          t("content_screen.status_asile"),
          t("content_screen.status_subsidiaire"),
          t("content_screen.status_apatride"),
          t("content_screen.status_french"),
        ].join(", ");
      }
      return capitalizeFirstLetter(
        metadatas.publicStatus
          ?.map((status) => t(`content_screen.status_${status}`, status))
          .join(", ") || ""
      );
    case "public":
      return metadatas.public?.join(", ");
    case "frenchLevel":
      if (
        !metadatas.frenchLevel ||
        metadatas.frenchLevel.length === ALL_FRENCH_LEVELS
      ) {
        return t("content_screen.all_french_levels", "Tous les niveaux");
      }
      return metadatas.frenchLevel?.join(", ");
    case "age":
      return getAge(metadatas.age, t);
    case "price":
      return metadatas.price?.values[0] === 0
        ? t("content_screen.free", "Gratuit")
        : metadatas.price?.values[0] + "€ " + metadatas.price?.details;
    case "commitment":
      return getCommitment(metadatas.commitment, t);
    case "frequency":
      return getFrequency(metadatas.frequency, t);
    case "timeSlots":
      return getTimeSlots(metadatas.timeSlots, t);
    case "location":
      return getLocation(metadatas.location, t);
    default:
      return metadatas[key];
  }
};
