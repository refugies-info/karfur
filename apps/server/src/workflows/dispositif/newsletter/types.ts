export type DispositifDesc = {
  titre: string;
  url: string;
  abstract: string;
};

export type DemarchesData = {
  publications: DispositifDesc[];
  updates: DispositifDesc[];
};

export type DispositifsData = {
  publications: DispositifDesc[];
};
