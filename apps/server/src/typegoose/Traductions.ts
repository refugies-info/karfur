export type { TraductionDiff, TraductionId, Traductions } from "@refugies-info/mongo";
export { TraductionsModel, TraductionsStatus, TraductionsType } from "@refugies-info/mongo";

// Re-export business logic helpers for convenience if needed, or import directly from modules
export {
  computeTraductionFinished,
  diffTraductions,
  getSectionsTranslated,
  getTraductionStatus,
  getTraductionUser,
  getTraductionWordsCount,
} from "~/modules/traductions/traductions.business";
