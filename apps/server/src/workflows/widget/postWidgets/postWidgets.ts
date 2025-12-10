import type { PostWidgetResponse, WidgetRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import { createWidget } from "~/modules/widgets/widgets.repository";
import { ObjectId, type Widget } from "~/typegoose";
import type { ResponseWithData } from "~/types/interface";

export const postWidgets = async (
  body: WidgetRequest,
  userId: string,
): ResponseWithData<PostWidgetResponse> => {
  logger.info("[postWidgets] received", body);

  const widget: Partial<Widget> = {
    name: body.name,
    themes: body.themes.map((t) => new ObjectId(t.toString())),
    typeContenu: body.typeContenu,
    author: new ObjectId(userId),
    tags: [], // Default empty array as per schema if needed, or handle in repo
  };

  if (body.languages?.length) {
    widget.languages = body.languages;
  }
  if (body.department) {
    widget.department = body.department;
  }
  const dbWidget = await createWidget(widget as Widget);

  return {
    text: "success",
    data: dbWidget as PostWidgetResponse,
  };
};
