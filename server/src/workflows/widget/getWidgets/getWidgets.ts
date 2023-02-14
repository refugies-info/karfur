import logger from "../../../logger";
import { Id, ResponseWithData } from "../../../types/interface";
import { getAllWidgets } from "../../../modules/widgets/widgets.repository";

export interface GetWidgetResponse {
  _id: Id;
  name: string;
  tags: string[];
  themes: Id[];
  typeContenu: ("dispositif" | "demarche")[];
  department: string;
  languages: string[];
  author: { username: string };
  created_at: Date;
}

export const getWidgets = async (): ResponseWithData<GetWidgetResponse[]> => {
  logger.info("[getWidgets] received");

  const widgets = await getAllWidgets();
  return {
    text: "success",
    //@ts-ignore FIXME: include created_at
    data: widgets
  }
};
