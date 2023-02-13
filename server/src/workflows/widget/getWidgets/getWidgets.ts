import logger from "../../../logger";
import { ExcludeMethods, ResponseWithData } from "../../../types/interface";
import { getAllWidgets } from "../../../modules/widgets/widgets.repository";
import { Types } from "mongoose";

type Id = ExcludeMethods<Types.ObjectId | string>;
export interface GetWidgetResponse {
  name: string;
  tags: string[];
  themes: Id[];
  typeContenu: ("dispositif" | "demarche")[];
  department: string;
  languages: string[];
  author: string;
}

export const getWidgets = async (): ResponseWithData<GetWidgetResponse[]> => {
  logger.info("[getWidgets] received");

  const widgets = await getAllWidgets();
  return {
    text: "success",
    data: widgets
  }
};
