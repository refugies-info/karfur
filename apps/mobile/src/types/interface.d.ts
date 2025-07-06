/**
 * @deprecated
 */
export type ObjectId = unknown;

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
  vicinity?: string | null;
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
  ref: ReadingObject;
}

export type ReadingObject = {
  // eslint-disable-next-line no-unused-vars
  getReadingItem: (currentScroll: number) => Promise<ReadingItem | undefined>;
};
