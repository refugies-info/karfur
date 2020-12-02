import { IDispositif } from "../../types/interface";
import { Dispositif } from "../../schema/schemaDispositif";
import { ObjectId } from "mongoose";

export const getDispositifsFromDB = async (
  needFields: Object
): Promise<IDispositif[]> =>
  await Dispositif.find({}, needFields).populate("mainSponsor");

export const updateDispositifStatusInDB = async (
  _id: ObjectId,
  newDispositif: { status: string; publishedAt: number } | { status: string }
) => await Dispositif.findOneAndUpdate({ _id }, newDispositif);
