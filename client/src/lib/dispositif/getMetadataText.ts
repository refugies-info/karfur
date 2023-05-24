import { Metadatas } from "@refugies-info/api-types"
import { jsUcfirst } from "lib";
import { TFunction } from "next-i18next";

export const getCommitmentText = (data: Metadatas["commitment"] | undefined, t: TFunction): string | null => {
  if (!data) return null;

  if (data.amountDetails === "between" && data.hours.length >= 2) {
    return jsUcfirst(t("Infocards.commitmentBetween", { min: data.hours[0], max: data.hours[1], unit: t(`Infocards.${data.timeUnit}`) }));
  }

  return jsUcfirst(`${t(`Infocards.${data.amountDetails}`)} ${data.hours[0]} ${t(`Infocards.${data.timeUnit}`)}`);
}

export const getPriceText = (data: Metadatas["price"] | undefined, t: TFunction): string | null => {
  if (!data) return null;
  if (data.values?.[0] === 0) return jsUcfirst(t("Infocards.free"));
  if (data.values.length === 0) return jsUcfirst(t("Infocards.freeAmount"))
  if (data.values.length === 2) return jsUcfirst(`${t("Infocards.priceBetween", { min: data.values[0], max: data.values[1], details: data.details ? t(`Infocards.${data.details}`) : "" })}`)
  return jsUcfirst(`${data.values[0]}€ ${data.details ? t(`Infocards.${data.details}`) : ""}`);
}


export const getPublicStatusText = (data: Metadatas["publicStatus"] | undefined, t: TFunction): string | null => {
  if (!data) return null;
  return jsUcfirst(data.map(d => t(`Infocards.${d}`)).join(", "));
}

export const getPublicText = (data: Metadatas["public"] | undefined, t: TFunction): string | null => {
  if (!data) return null;
  return jsUcfirst(data.map(d => t(`Infocards.${d}`)).join(", "));
}

export const getAgeText = (data: Metadatas["age"] | undefined, t: TFunction): string | null => {
  if (!data) return null;

  switch (data.type) {
    case "lessThan":
      return jsUcfirst(t("Infocards.ageLessThan", { age: data.ages[0] }));
    case "moreThan":
      return jsUcfirst(t("Infocards.ageMoreThan", { age: data.ages[0] }));
    case "between":
      return jsUcfirst(t("Infocards.ageBetween", { min: data.ages[0], max: data.ages[1] }));
  }
}

export const getFrequencyText = (data: Metadatas["frequency"] | undefined, t: TFunction): string | null => {
  if (!data) return null;
  return jsUcfirst(`${t(`Infocards.${data.amountDetails}`)} ${data.hours} ${t(`Infocards.${data.timeUnit}`)} ${t(`Infocards.${data.frequencyUnit}`)}`);
}

export const getTimeSlotsText = (data: Metadatas["timeSlots"] | undefined, t: TFunction): string | null => {
  if (!data) return null;
  if (data.length === 7) return t("Infocards.everyday");
  return jsUcfirst(data.map(d => t(`Infocards.${d}`)).join(", "));
}

export const getFrenchLevelText = (data: Metadatas["frenchLevel"] | undefined, t: TFunction): string | null => {
  if (!data) return null;
  return jsUcfirst(data?.map(d => d === "alpha" ? t("Infocards.alpha") : d).join(", "));
}

