import { Metadatas } from "@refugies-info/api-types";

export const getInitialPrice = (price: Metadatas["price"] | undefined): "free" | "pay" | null | undefined => {
  if (!price) return price;
  if (price.values.length === 2) return "pay";
  if (price.values.length === 1 && price.values[0] === 0) return "free";
  return "pay";
}

export const getInitialType = (price: Metadatas["price"] | undefined): "once" | "between" | "free" | undefined => {
  if (!price) return undefined;
  if (price.values.length === 2) return "between";
  if (price.values.length === 1) return "once";
  return "free";
}

export const isPriceValue = (text: string) => text.match(/^(\d*\.{0,1}\d{0,1}$)/);
