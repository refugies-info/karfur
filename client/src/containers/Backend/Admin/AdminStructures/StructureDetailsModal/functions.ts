import { GetAllDispositifsResponse, GetThemeResponse, Id, SimpleUser } from "@refugies-info/api-types";

export type Dispositif = {
  _id: Id;
  titreInformatif: string;
  creator: SimpleUser | null;
  created_at?: Date;
  status: string;
  color: string;
  color30: string;
  hasCreatedStructure: boolean;
};

export const getDispositifsWithAllInformationRequired = (
  dispositifsIds: Id[],
  allDispositifs: GetAllDispositifsResponse[],
  themes: GetThemeResponse[]
): Dispositif[] => {
  let dispositifsWithAllInformation: Dispositif[] = [];
  dispositifsIds.forEach((dispositifId, index) => {
    let simplifiedDispositif = allDispositifs.find(
      (dispositif) => dispositif._id === dispositifId
    );
    if (simplifiedDispositif) {
      const theme = themes.find(t => simplifiedDispositif?.theme === t._id);
      let element = {
        titreInformatif: simplifiedDispositif.titreInformatif,
        creator: simplifiedDispositif.creatorId,
        created_at: simplifiedDispositif.created_at,
        _id: simplifiedDispositif._id,
        status: simplifiedDispositif.status,
        color: theme?.colors?.color100 || "#000000",
        color30: theme?.colors?.color30 || "#CCCCCC",
        hasCreatedStructure: index === 0
      };
      dispositifsWithAllInformation.push(element);
    }
  });
  return dispositifsWithAllInformation.sort((a, b) => a.titreInformatif.localeCompare(b.titreInformatif));
};
