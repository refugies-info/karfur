import { Traduction } from "../../schema/schemaTraduction";

export const getTraductionsByLanguage = async (
  langue: string,
  isExpert: boolean,
  neededFields: Record<string, number>
) => {
  let query: any = { langueCible: langue };
  if (!isExpert) {
    query = {
      $or: [
        {
          status: "À traduire",
        },
        {
          status: "Validée",
        },
      ],
      langueCible: langue,
    };
  }
  return await Traduction.find(query, neededFields);
};
