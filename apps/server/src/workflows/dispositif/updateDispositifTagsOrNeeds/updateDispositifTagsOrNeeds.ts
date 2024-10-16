import { DispositifThemeNeedsRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import {
  getDispositifById,
  getDraftDispositifById,
  updateDispositifInDB,
} from "~/modules/dispositif/dispositif.repository";
import { computePossibleNeeds } from "~/modules/needs/needs.service";
import { ObjectId, User } from "~/typegoose";
import { Response } from "~/types/interface";
import { log } from "./log";

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
  const draftOriginalDispositif = await getDraftDispositifById(id, { needs: 1 });
  const originalDispositif = draftOriginalDispositif || (await getDispositifById(id, { needs: 1 }));
  if (body.theme || body.secondaryThemes) {
    if (body.needs || originalDispositif.needs) {
      // if a need of the content has a tag that is not a tag of the content we remove the need
      newNeeds = await computePossibleNeeds(body.needs || originalDispositif.needs.map((n) => n.toString()), allThemes);
    }
  }

  const newDispositif = {
    theme: new ObjectId(body.theme),
    secondaryThemes: [...new Set(body.secondaryThemes)].map((s) => new ObjectId(s)),
    needs: newNeeds.map((n) => new ObjectId(n)),
    themesSelectedByAuthor: (body.theme || body.secondaryThemes) && user.isAdmin(),
  };

  // update draft and original
  if (draftOriginalDispositif) {
    await updateDispositifInDB(id, newDispositif, true);
  }
  await updateDispositifInDB(id, newDispositif, false);
  await log(id, allThemes.length > 0, user._id);

  return { text: "success" };
};
