import { PostWidgetResponse, WidgetRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import { createWidget } from "~/modules/widgets/widgets.repository";
import { ObjectId, Widget } from "~/typegoose";
import { ResponseWithData } from "~/types/interface";

export const postWidgets = async (body: WidgetRequest, userId: string): ResponseWithData<PostWidgetResponse> => {
  logger.info("[postWidgets] received", body);

  const widget = new Widget();
  widget.name = body.name;
  widget.themes = body.themes.map((t) => new ObjectId(t.toString()));
  widget.typeContenu = body.typeContenu;
  widget.author = new ObjectId(userId);

  if (body.languages?.length) {
    widget.languages = body.languages;
  }
  if (body.department) {
    widget.department = body.department;
  }
  const dbWidget = await createWidget(widget);

  return {
    text: "success",
    data: dbWidget,
  };
};
