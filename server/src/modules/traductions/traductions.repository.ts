import { Traduction } from "../../schema/schemaTraduction";

export const getTraductionsByLanguage = async (
  langue: string,
  neededFields: Record<string, number>
) => await Traduction.find({ langueCible: langue }, neededFields);
