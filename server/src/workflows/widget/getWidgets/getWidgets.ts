import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { getAllWidgets } from "../../../modules/widgets/widgets.repository";
import { GetWidgetResponse } from "api-types";

export const getWidgets = async (): ResponseWithData<GetWidgetResponse[]> => {
  logger.info("[getWidgets] received");

  const widgets = await getAllWidgets();
  return {
    text: "success",
    //@ts-ignore FIXME: include created_at
    data: widgets
  }
};
