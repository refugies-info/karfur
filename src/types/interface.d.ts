import { Languages } from "@refugies-info/api-types";
import { Moment } from "moment";

/**
 * @deprecated
 */
export type ObjectId = any;

export interface ThemeColors {
  color100: string;
  color80: string;
  color60: string;
  color40: string;
  color30: string;
}

export interface MarkerGoogle {
  address?: string;
  email?: string;
  latitude: number;
  longitude: number;
  nom: string;
  telephone?: string;
  vicinity: string;
  description?: string;
  place_id: string;
}

export interface MapGoogle {
  markers: MarkerGoogle[];
}

export interface ReadingItem {
  id: string;
  posX: number;
  posY: number;
  text: string;
}
