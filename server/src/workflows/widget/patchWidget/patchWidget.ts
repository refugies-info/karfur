import logger from "../../../logger";
import { Id, ResponseWithData } from "../../../types/interface";
import { updateWidget } from "../../../modules/widgets/widgets.repository";
import { Widget } from "../../../typegoose";
import { WidgetRequest } from "../../../controllers/widgetController";

export interface PatchWidgetResponse {
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

export const patchWidget = async (id: string, body: Partial<WidgetRequest>, userId: string): ResponseWithData<PatchWidgetResponse> => {
  logger.info("[patchWidget] received", id);

  const widget: Partial<Widget> = {
    //@ts-ignore
    author: userId, // FIXME ref types
    typeContenu: body.typeContenu,
    //@ts-ignore
    themes: body.themes, // FIXME ref types
    languages: body.languages,
    department: body.department
  };

  const dbWidget = await updateWidget(id, widget);

  return {
    text: "success",
    //@ts-ignore FIXME: include created_at
    data: dbWidget
  }
};
