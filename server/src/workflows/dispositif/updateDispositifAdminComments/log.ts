import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";
import { DispositifDoc } from "../../../schema/schemaDispositif";

export const log = async (
  dispositifId: ObjectId,
  dispositif: Partial<DispositifDoc>,
  oldDispositif: DispositifDoc,
  authorId: ObjectId
) => {
  if (dispositif.adminComments !== oldDispositif.adminComments) {
    await addLog(
      dispositifId,
      "Dispositif",
      "Note interne modifiée",
      { author: authorId }
    );
  }
}
