import { ProgressionIndicator } from "@refugies-info/api-types";
import { IndicatorModel, ObjectId } from "../../typegoose";

const axios = require("axios");
const instance = axios.create();
instance.defaults.timeout = 12000000;

export const computeGlobalIndicator = async (userId: string): Promise<ProgressionIndicator> =>
  IndicatorModel.aggregate<ProgressionIndicator>([
    {
      $match: {
        userId: new ObjectId(userId),
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
