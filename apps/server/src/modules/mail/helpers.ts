import type { StructureId, UserId } from "@refugies-info/mongo";
import { StructureModel } from "@refugies-info/mongo";
import logger from "~/logger";
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
  const structIdStr = structureId?.toString();

  logger.info("[consentsToEmail] ENTRY", {
    userId: id,
    templateName,
    structureId: structIdStr,
    hasStructureId: !!structureId,
  });

  // 1. Check for a user-level block. A `false` here is a definitive "no".
  const userPref = USER_PREFS[id]?.[templateName];
  logger.info("[consentsToEmail] User pref check", {
    userId: id,
    templateName,
    userPref,
    hasUserPref: userPref !== undefined,
  });

  if (userPref === false) {
    logger.info("[consentsToEmail] BLOCKED by user pref", { userId: id, templateName });
    return false;
  }

  // 2. Check structure-level preferences ONLY if:
  //    - structureId is provided, AND
  //    - user is actually a member of that structure
  if (structureId) {
    const structId = structureId.toString();
    const structPrefs = STRUCTURE_PREFS[structId];
    const structPref = structPrefs?.[templateName];

    logger.info("[consentsToEmail] Checking structure prefs", {
      structId,
      templateName,
      structurePref: structPref,
      hasStructurePref: structPref !== undefined,
    });

    // Verify user is a member of this structure
    const query = { _id: structId, "membres.userId": id };
    logger.info("[consentsToEmail] Membership query", { query });

    const membership = await StructureModel.findOne(query, { _id: 1 }).lean();

    logger.info("[consentsToEmail] Membership result", {
      structId,
      userId: id,
      isMember: !!membership,
      membership,
    });

    if (membership) {
      logger.info("[consentsToEmail] Structure pref value", {
        structId,
        templateName,
        structPref,
      });

      if (structPref === false) {
        logger.info("[consentsToEmail] BLOCKED by structure pref", {
          structId,
          userId: id,
          templateName,
        });
        return false;
      }
    } else {
      logger.info("[consentsToEmail] User not a member, skipping structure pref check", {
        structId,
        userId: id,
      });
    }
  } else {
    logger.info("[consentsToEmail] No structureId provided, skipping structure pref check");
  }

  // 3. Check for explicit user-level allow, or default to true
  const finalDecision = userPref ?? true;
  logger.info("[consentsToEmail] ALLOWED (default)", {
    userId: id,
    templateName,
    finalDecision,
    reason: userPref === true ? "explicit user allow" : "default true",
  });

  return finalDecision;
};
