// import {
//   turnToLocalizedNew,
//   markTradModifications,
//   countContents,
//   countValidated
// } from "../../controllers/dispositif/functions";
import logger from "../../logger";
// import ErrorDB from "../../schema/schemaError";
// import { getExpertTraductionByLanguage, updateTradsWithARevoir, updateTradInDB } from "./traductions.repository";
// import { ObjectId } from "mongoose";
// import { Dispositif } from "src/typegoose";

export const updateTraductions = async (/*originalDis: Dispositif, dispositif: Dispositif, userId: ObjectId*/) => {
  logger.info("[updateTraductions] received");
  throw new Error("TODO refactor");
  // const originalTrads = {};

  // // We fetch the French key to know the original text, turnToLocalized takes a dispositif with multiple translated language keys and returns one specified language
  // const dispositifFr = await turnToLocalizedNew(originalDis, "fr");

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // for (let [key, value] of Object.entries(originalDis.avancement)) {
  //   if (key !== "fr") {
  //     //we put the different translations before the update in an object by key
  //     // @ts-ignore
  //     originalTrads[key] = await getExpertTraductionByLanguage(
  //       originalDis._id,
  //       key
  //     );

  //     // @ts-ignore
  //     for (let tradExpert of originalTrads[key]) {
  //       logger.info("[updateTraductions] before markTradModifications", {
  //         id: dispositifFr._id,
  //       });
  //       /*   now we compare the old french version of the dispositif with new updated one,
  //      and for every change we mark the paragraph/title/etc. within the translation so that we can propose it and highlight it in the 'à revoir' section  */
  //       try {
  //         tradExpert = markTradModifications(
  //           dispositif,
  //           dispositifFr,
  //           tradExpert,
  //           userId
  //         );
  //       } catch (e) {
  //         new ErrorDB({
  //           name: "markTradModifications",
  //           userId: userId,
  //           dataObject: dispositif,
  //           error: e,
  //         }).save();
  //       }
  //       // we update the percentage of the translation done after the modified fields if status is 'À revoir' (so the original version in french as been modified)
  //       if (tradExpert.status === "À revoir") {
  //         const contentsTotal = countContents(dispositif.contenu) - 1;
  //         const validatedTotal = countValidated([tradExpert.translatedText]);
  //         const newAvancement = validatedTotal / contentsTotal;
  //         tradExpert.avancement = newAvancement;

  //         //we update all possible translations standing with the new percentage
  //         await updateTradsWithARevoir(originalDis._id, key, newAvancement);
  //       }

  //       //we update the expert trad with the new modified trad
  //       await updateTradInDB(tradExpert._id, tradExpert);
  //     }
  //   }
  // }
};
