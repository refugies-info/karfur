import { Metadatas } from "api-types"
/* TODO : translate all */

export const getCommitmentText = (data: Metadatas["commitment"] | undefined): string | null => {
  if (!data) return null;

  if (data.amountDetails === "between" && data.hours.length >= 2) {
    return `${data.amountDetails} ${data.hours[0]} et ${data.hours[1]} ${data.timeUnit}`;
  }

  return `${data.amountDetails} ${data.hours[0]} ${data.timeUnit}`;
}

export const getPriceText = (data: Metadatas["price"] | undefined): string | null => {
  if (!data) return null;
  if (data.values?.[0] === 0) return "Gratuit";
  if (data.values.length === 0) return "Montant libre";
  if (data.values.length === 2) return `entre ${data.values[0]}€ et ${data.values[1]}€ ${data.details || ""}`;
  return `${data.values[0]}€ ${data.details || ""}`;
}


export const getPublicStatusText = (data: Metadatas["publicStatus"] | undefined): string | null => {
  if (!data) return null;
  return data.join(", ");
}

export const getPublicText = (data: Metadatas["public"] | undefined): string | null => {
  if (!data) return null;
  return data.join(", ");
}

export const getAgeText = (data: Metadatas["age"] | undefined): string | null => {
  if (!data) return null;

  switch (data.type) {
    case "lessThan":
      return `Moins de ${data.ages[0]} ans`;
    case "moreThan":
      return `Plus de ${data.ages[0]} ans`;
    case "between":
      return `Entre ${data.ages[0]} et ${data.ages[1]} ans`;
  }
}

export const getFrequencyText = (data: Metadatas["frequency"] | undefined): string | null => {
  if (!data) return null;
  return `${data.amountDetails} ${data.hours} ${data.timeUnit} par ${data.frequencyUnit}`;
}

export const getTimeSlotsText = (data: Metadatas["timeSlots"] | undefined): string | null => {
  if (!data) return null;
  if (data.length === 7) return "Tous les jours";
  return data.join(", ");
}

export const getFrenchLevelText = (data: Metadatas["frenchLevel"] | undefined): string | null => {
  if (!data) return null;
  return data?.join(", ")
}

