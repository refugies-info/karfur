import { GetWidgetResponse } from "@refugies-info/api-types";
import logger from "~/logger";
import { getAllWidgets } from "~/modules/widgets/widgets.repository";
import { ResponseWithData } from "~/types/interface";

export const getWidgets = async (): ResponseWithData<GetWidgetResponse[]> => {
  logger.info("[getWidgets] received");

  const widgets = await getAllWidgets();
  return {
    text: "success",
    data: widgets,
  };
};
