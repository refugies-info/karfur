import type { StructureId, UserId } from "@refugies-info/mongo";
import { StructureModel } from "@refugies-info/mongo";
import type { TemplateName } from "../../connectors/sendgrid/sendgrid.types";
import { STRUCTURE_PREFS, USER_PREFS } from "./data";

/**
 * Check if user consents to receiving a specific email template.
 * Checks both user-level and structure-level preferences.
 *
 * Priority: structure-level preferences override user-level defaults.
 *
 * @param userId - The user's ID
 * @param templateName - The email template name
 * @param structureId - Optional: if known, check this structure directly (avoids DB query)
 * @returns true if user consents, false otherwise
 */
export const consentsToEmail = async (
  userId: UserId,
  templateName: TemplateName,
  structureId?: StructureId,
): Promise<boolean> => {
  const id = userId.toString();

  // 1. Check user-level preferences first
  if (USER_PREFS[id]?.[templateName] !== undefined) {
    return USER_PREFS[id][templateName];
  }

  // 2. Check structure-level preferences
  // If structureId provided, use it directly (avoids DB query)
  // Otherwise, find user's structures
  let structureIds: string[] = structureId ? [structureId.toString()] : [];

  if (!structureId) {
    const structures = await StructureModel.find({ "membres.userId": id }, { _id: 1 }).lean();
    structureIds = structures.map((s) => s._id.toString());
  }

  // If any structure has this template disabled, respect that
  for (const structId of structureIds) {
    if (STRUCTURE_PREFS[structId]?.[templateName] === false) {
      return false;
    }
  }

  // 3. Default to true
  return true;
};
