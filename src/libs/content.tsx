import React from "react";
import { conditionType, Metadatas } from "@refugies-info/api-types";
import { Rows, RowsSpacing, TextSmallNormal } from "../components";

import imgOfpra from "../theme/images/demarche/acte_naissance_OFPRA.png";
import imgTse from "../theme/images/demarche/titreSejour.png";
import imgOfii from "../theme/images/demarche/ofii.png";
import imgCb from "../theme/images/demarche/carteBancaire.png";
import imgPoleEmploi from "../theme/images/demarche/poleEmploi.png";
import imgDriver from "../theme/images/demarche/permisConduire.png";

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
  if (!data) return "";
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

  return (
    <Rows layout="1" spacing={RowsSpacing.Text}>
      {data.map((dep: string) => {
        const [nbDep, nomDep] = dep.split(" - ");
        return (
          <TextSmallNormal key={nbDep}>
            {`${nomDep} (${nbDep})`}
          </TextSmallNormal>
        );
      })}
    </Rows>
  );
};

const getCommitment = (
  commitment: Metadatas["commitment"] | null | undefined
) => {
  if (!commitment) return commitment;
  // TODO : translate
  return `${commitment.amountDetails} ${commitment.hours} ${commitment.timeUnit}`;
};
const getFrequency = (frequency: Metadatas["frequency"] | null | undefined) => {
  if (!frequency) return frequency;
  // TODO : translate
  return `${frequency.amountDetails} ${frequency.hours} ${frequency.timeUnit} par ${frequency.frequencyUnit}`;
};
const getTimeSlots = (timeSlots: Metadatas["timeSlots"] | null | undefined) => {
  if (!timeSlots) return timeSlots;
  // TODO : translate
  return timeSlots.join(", ");
};

export const getDescriptionNew = (
  metadatas: Metadatas,
  key: keyof Metadatas,
  t: any
) => {
  switch (key) {
    case "publicStatus":
      return capitalizeFirstLetter(
        metadatas.publicStatus
          ?.map((status) => t(`content_screen.status_${status}`, status))
          .join(", ") || ""
      );
    case "public":
      return metadatas.public?.join(", ");
    case "frenchLevel":
      return metadatas.frenchLevel?.join(", ");
    case "age":
      return getAge(metadatas.age, t);
    case "price":
      return metadatas.price?.values[0] === 0
        ? t("content_screen.free", "Gratuit")
        : metadatas.price?.values[0] + "€ " + metadatas.price?.details;
    case "commitment":
      return getCommitment(metadatas.commitment);
    case "frequency":
      return getFrequency(metadatas.frequency);
    case "timeSlots":
      return getTimeSlots(metadatas.timeSlots);
    case "location":
      return getLocation(metadatas.location, t);
    default:
      return metadatas[key];
  }
};
