import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { createWidget } from "../../../modules/widgets/widgets.repository";
import { Widget } from "src/typegoose";
import { WidgetRequest } from "src/controllers/widgetController";

export interface PostWidgetResponse {
  name: string;
  tags: string[];
  themes: any[]; // FIXME : type objectId
  typeContenu: ("dispositif" | "demarche")[];
  department: string;
  languages: string[];
  author: string;
}

export const postWidgets = async (body: WidgetRequest, userId: string): ResponseWithData<PostWidgetResponse> => {
  logger.info("[postWidgets] received", body);

  const widget = new Widget();
  widget.name = body.name;
  //@ts-ignore
  widget.themes = body.themes.map((t) => t._id); // FIXME ref types
  widget.typeContenu = body.typeContenu;
  //@ts-ignore
  widget.author = userId; // FIXME ref types

  if (body.languages?.length) {
    widget.languages = body.languages;
  }
  if (body.department) {
    widget.department = body.department;
  }
  const dbWidget = await createWidget(widget);

  return {
    text: "success",
    data: dbWidget
  }
};
