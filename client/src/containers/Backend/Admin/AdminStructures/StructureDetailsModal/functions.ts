import { GetAllDispositifsResponse, Id } from "api-types";
import { Moment } from "moment";
import { SimplifiedCreator } from "types/interface";

export type Dispositif = {
  titreInformatif: string;
  creator: SimplifiedCreator | null;
  created_at: Moment;
  _id: Id;
  status: string;
  color: string;
  color30: string;
  hasCreatedStructure: boolean;
};

export const getDispositifsWithAllInformationRequired = (
  dispositifsIds: Id[],
  allDispositifs: GetAllDispositifsResponse[]
): Dispositif[] => {
  let dispositifsWithAllInformation: Dispositif[] = [];
  dispositifsIds.forEach((dispositifId, index) => {
    let simplifiedDispositif = allDispositifs.find(
      (dispositif) => dispositif._id === dispositifId
    );
    if (simplifiedDispositif) {
      let element = {
        titreInformatif: simplifiedDispositif.titreInformatif,
        creator: simplifiedDispositif.creatorId,
        created_at: simplifiedDispositif.created_at,
        _id: simplifiedDispositif._id,
        status: simplifiedDispositif.status,
        color: simplifiedDispositif.theme?.colors?.color100 || "#000000",
        color30: simplifiedDispositif.theme?.colors?.color30 || "#CCCCCC",
        hasCreatedStructure: index === 0
      };
      dispositifsWithAllInformation.push(element);
    }
  });
  return dispositifsWithAllInformation.sort((a, b) => a.titreInformatif.localeCompare(b.titreInformatif));
};
