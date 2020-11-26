import { IDispositif } from "../../types/interface";
import Dispositif from "../../schema/schemaDispositif";

export const getDispositifsFromDB = async (
  needFields: Object
): Promise<IDispositif[]> =>
  await Dispositif.find({}, needFields).populate("mainSponsor");
