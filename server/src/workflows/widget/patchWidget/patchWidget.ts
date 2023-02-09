import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { updateWidget } from "../../../modules/widgets/widgets.repository";
import { Widget } from "../../../typegoose";
import { WidgetRequest } from "../../../controllers/widgetController";

export interface PatchWidgetResponse {
  name: string;
  tags: string[];
  themes: any[]; // FIXME : type objectId
  typeContenu: ("dispositif" | "demarche")[];
  department: string;
  languages: string[];
  author: string;
}

export const patchWidget = async (id: string, body: Partial<WidgetRequest>, userId: string): ResponseWithData<PatchWidgetResponse> => {
  logger.info("[patchWidget] received", id);

  const widget: Partial<Widget> = {
    //@ts-ignore
    author: userId, // FIXME ref types
    typeContenu: body.typeContenu,
    //@ts-ignore
    themes: body.themes.map((t) => t._id), // FIXME ref types
    languages: body.languages,
    department: body.department
  };

  const dbWidget = await updateWidget(id, widget);

  return {
    text: "success",
    data: dbWidget
  }
};
