import type { PatchWidgetResponse, WidgetRequest } from "@refugies-info/api-types";
import { ObjectId, type Widget } from "@refugies-info/mongo";
import logger from "~/logger";
import { updateWidget } from "~/modules/widgets/widgets.repository";
import type { ResponseWithData } from "~/types/interface";

export const patchWidget = async (
  id: string,
  body: Partial<WidgetRequest>,
  userId: string,
): ResponseWithData<PatchWidgetResponse> => {
  logger.info("[patchWidget] received", id);

  const widget: Partial<Widget> = {
    author: new ObjectId(userId),
    typeContenu: body.typeContenu,
    themes: body.themes.map((t) => new ObjectId(t.toString())),
    languages: body.languages,
    department: body.department,
  };

  const dbWidget = await updateWidget(id, widget);

  return {
    text: "success",
    data: dbWidget as PatchWidgetResponse,
  };
};
