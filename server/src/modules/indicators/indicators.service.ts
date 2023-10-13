import { IndicatorModel } from "../../typegoose";
import { Id, Languages } from "@refugies-info/api-types";

// We save a new indicator document to know the number of words translated and the time spent, this is needed for stats in the front
export const updateIndicator = async (userId: Id, dispositifId: Id, language: Languages, timeSpent: number, wordsCount: number) => {
  const oldIndicator = await IndicatorModel.findOne({ userId, dispositifId, language });
  if (oldIndicator) {
    return IndicatorModel.findOneAndUpdate({ _id: oldIndicator._id }, {
      wordsCount,
      $inc: { timeSpent }
    });
  }

  return IndicatorModel.create({
    userId,
    dispositifId,
    language,
    timeSpent,
    wordsCount,
  });
};
