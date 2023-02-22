import logger from "../../../logger";
import { Id, ResponseWithData } from "../../../types/interface";
import { updateWidget } from "../../../modules/widgets/widgets.repository";
import { Id as ObjectId, Widget } from "../../../typegoose";
import { WidgetRequest } from "../../../controllers/widgetController";

export interface PatchWidgetResponse {
  _id: Id;
  name: string;
  tags: string[];
  themes: string[];
  typeContenu: ("dispositif" | "demarche")[];
  department: string;
  languages: string[];
  author: { username: string };
  created_at: Date;
}

export const patchWidget = async (
  id: string,
  body: Partial<WidgetRequest>,
  userId: string,
): ResponseWithData<PatchWidgetResponse> => {
  logger.info("[patchWidget] received", id);

  const widget: Partial<Widget> = {
    author: new ObjectId(userId),
    typeContenu: body.typeContenu,
    themes: body.themes.map(t => new ObjectId(t.toString())),
    languages: body.languages,
    department: body.department,
  };

  const dbWidget = await updateWidget(id, widget);

  return {
    text: "success",
    //@ts-ignore FIXME: include created_at
    data: dbWidget,
  };
};
