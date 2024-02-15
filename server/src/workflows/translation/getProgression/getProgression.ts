import { GetProgressionResponse, ProgressionIndicator } from "@refugies-info/api-types";
import { computeGlobalIndicator } from "../../../controllers/traduction/lib";
import logger from "../../../logger";
import { IndicatorModel, ObjectId } from "../../../typegoose";

export const computeIndicator = async (userId: string, start: Date, end: Date): Promise<ProgressionIndicator> =>
  IndicatorModel.aggregate([
    {
      $match: {
        userId: new ObjectId(userId),
        updatedAt: { $gte: end, $lt: start },
      },
    },
    {
      $group: {
        _id: null,
        wordsCount: { $sum: "$wordsCount" },
        timeSpent: { $sum: "$timeSpent" },
      },
    },
  ]).then((results) => results.shift());

export const computeAllIndicators = async (userId: string, onlyTotal: boolean): Promise<GetProgressionResponse> => {
  logger.info("[computeAllIndicators] received for userId", userId);
  try {
    logger.info("[computeAllIndicators] computing indicators");
    const totalIndicator = await computeGlobalIndicator(userId);

    let response: GetProgressionResponse = {
      totalIndicator
    };

    if (!onlyTotal) {
      var start = new Date();
      var end3 = new Date();
      var end6 = new Date();
      var end12 = new Date();
      //we define the different time periods 3/6/12 months
      end3.setMonth(end3.getMonth() - 3);
      end6.setMonth(end6.getMonth() - 6);
      end12.setMonth(end12.getMonth() - 12);
      //start.setHours(0, 0, 0, 0);

      //we aggregate the number of words and time spent in these periods
      response.threeMonthsIndicator = await computeIndicator(userId, start, end3);
      response.sixMonthsIndicator = await computeIndicator(userId, start, end6);
      response.twelveMonthsIndicator = await computeIndicator(userId, start, end12);
    }

    return response;
  } catch (e) {
    logger.error("[computeAllIndicators] error", e);
    return {
      twelveMonthsIndicator: null,
      sixMonthsIndicator: null,
      threeMonthsIndicator: null,
      totalIndicator: null,
    };
  }
};

const getProgression = (userId: string, onlyTotal: boolean): Promise<GetProgressionResponse> => computeAllIndicators(userId, onlyTotal);

export default getProgression;
