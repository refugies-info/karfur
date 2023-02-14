import logger from "../../../logger";
import { Id, ResponseWithData } from "../../../types/interface";
import { createWidget } from "../../../modules/widgets/widgets.repository";
import { Widget } from "../../../typegoose";
import { WidgetRequest } from "../../../controllers/widgetController";

export interface PostWidgetResponse {
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

export const postWidgets = async (body: WidgetRequest, userId: string): ResponseWithData<PostWidgetResponse> => {
  logger.info("[postWidgets] received", body);

  const widget = new Widget();
  widget.name = body.name;
  //@ts-ignore
  widget.themes = body.themes; // FIXME ref types
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
    //@ts-ignore FIXME: include created_at
    data: dbWidget
  }
};
