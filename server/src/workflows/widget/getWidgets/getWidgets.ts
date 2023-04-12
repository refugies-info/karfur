import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { getAllWidgets } from "../../../modules/widgets/widgets.repository";
import { GetWidgetResponse } from "@refugies-info/api-types";

export const getWidgets = async (): ResponseWithData<GetWidgetResponse[]> => {
  logger.info("[getWidgets] received");

  const widgets = await getAllWidgets();
  return {
    text: "success",
    // FIXME: include created_at
    //@ts-ignore
    data: widgets,
  };
};
