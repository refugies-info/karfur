import logger from "../../../logger";
import { updateDispositifInDB, getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { computePossibleNeeds } from "../../../modules/needs/needs.service";
import { log } from "./log";
import { ObjectId, User } from "../../../typegoose";
import { DispositifThemeNeedsRequest } from "@refugies-info/api-types";
import { Response } from "../../../types/interface";

export const updateDispositifTagsOrNeeds = async (
  id: string,
  body: DispositifThemeNeedsRequest,
  user: User,
): Response => {
  logger.info("[updateDispositifTagsOrNeeds]", { id, body });

  const allThemes: string[] = [];
  if (body.theme) allThemes.push(body.theme);
  if (body.secondaryThemes?.length) allThemes.push(...body.secondaryThemes);

  let newNeeds: string[] = [];
  if (body.theme || body.secondaryThemes) {
    const originalDispositif = await getDispositifById(id, {
      needs: 1,
    });
    if (body.needs || originalDispositif.needs) {
      // if a need of the content has a tag that is not a tag of the content we remove the need
      newNeeds = await computePossibleNeeds(body.needs || originalDispositif.needs.map((n) => n.toString()), allThemes);
    }
  }

  const newDispositif = {
    theme: new ObjectId(body.theme),
    secondaryThemes: body.secondaryThemes.map((s) => new ObjectId(s)),
    needs: newNeeds.map((n) => new ObjectId(n)),
    themesSelectedByAuthor: (body.theme || body.secondaryThemes) && user.isAdmin(),
  };
  await log(id, allThemes.length > 0, user._id);

  await updateDispositifInDB(id, newDispositif);
  return { text: "success" };
};
