import { Moment } from "moment";
import { ObjectId } from "mongodb";
import { SimplifiedCreator, SimplifiedDispositif } from "types/interface";

export type Dispositif = {
  titreInformatif: string;
  creator: SimplifiedCreator | null;
  created_at: Moment;
  _id: ObjectId;
  status: string;
  color: string;
  hasCreatedStructure: boolean;
};

export const getStructureWithAllInformationRequired = (
  dispositifsIds: ObjectId[],
  allDispositifs: SimplifiedDispositif[]
): Dispositif[] => {
  let dispositifsWithAllInformation: Dispositif[] = [];
  dispositifsIds.forEach((dispositifId, index) => {
    let simplifiedDispositif = allDispositifs.find(
      (dispositif) => dispositif._id === dispositifId
    );
    if (simplifiedDispositif) {
      let element = {
        //@ts-ignore
        titreInformatif: simplifiedDispositif.titreInformatif.fr || simplifiedDispositif.titreInformatif,
        creator: simplifiedDispositif.creatorId,
        created_at: simplifiedDispositif.created_at,
        _id: simplifiedDispositif._id,
        status: simplifiedDispositif.status,
        color: simplifiedDispositif.theme.colors.color100 || "#000000",
        hasCreatedStructure: index === 0
      };
      dispositifsWithAllInformation.push(element);
    }
  });
  return dispositifsWithAllInformation.sort((a, b) => a.titreInformatif.localeCompare(b.titreInformatif));
};
