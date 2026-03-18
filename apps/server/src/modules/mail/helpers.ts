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
 * @param structureId - For structure-related emails: checks prefs only if user is a member
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

  // 2. Check structure-level preferences ONLY if:
  //    - structureId is provided, AND
  //    - user is actually a member of that structure
  if (structureId) {
    const structId = structureId.toString();

    // Verify user is a member of this structure
    const membership = await StructureModel.findOne(
      { _id: structId, "membres.userId": id },
      { _id: 1 },
    ).lean();

    if (membership && STRUCTURE_PREFS[structId]?.[templateName] === false) {
      return false;
    }
  }

  // 3. Check for explicit user-level allow, or default to true
  return USER_PREFS[id]?.[templateName] ?? true;
};
