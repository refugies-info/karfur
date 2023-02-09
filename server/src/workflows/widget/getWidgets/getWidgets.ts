import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { getAllWidgets } from "../../../modules/widgets/widgets.repository";

export interface GetWidgetResponse {
  name: string;
  tags: string[];
  themes: any[]; // FIXME : type objectId
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
