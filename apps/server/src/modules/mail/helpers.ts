import type { StructureId, UserId } from "@refugies-info/mongo";
import { StructureModel } from "@refugies-info/mongo";
import type { TemplateName } from "../../connectors/sendgrid/sendgrid.types";
import { STRUCTURE_PREFS, USER_PREFS } from "./data";

/**
 * Check if user consents to receiving a specific email template.
 *
 * A `false` preference at either the user or structure level will block the email.
 * If no preference is set, the email is allowed by default.
 * User-level preferences are checked first for a quick denial.
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

  // 1. Check for a user-level block. A `false` here is a definitive "no".
  if (USER_PREFS[id]?.[templateName] === false) {
    return false;
  }

  // 2. Check structure-level preferences
  // If structureId provided, use it directly (avoids DB query)
  // Otherwise, find user's structures
  let structureIds: string[] = structureId ? [structureId.toString()] : [];

  if (!structureId) {
    const structures = await StructureModel.find({ "membres.userId": id }, { _id: 1 }).lean();
    structureIds = structures.map((s) => s._id.toString());
  }

  // 3. If any structure has this template disabled, respect that (veto)
  for (const structId of structureIds) {
    if (STRUCTURE_PREFS[structId]?.[templateName] === false) {
      return false;
    }
  }

  // 4. Check for explicit user-level allow, or default to true
  return USER_PREFS[id]?.[templateName] ?? true;
};
