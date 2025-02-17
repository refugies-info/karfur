export type DispositifDesc = {
  titre: string;
  url: string;
  abstract: string;
};

export type DemarchesData = {
  newest: DispositifDesc;
  updated: DispositifDesc[];
};

export type DispositifsData = {
  newest: DispositifDesc[];
};
