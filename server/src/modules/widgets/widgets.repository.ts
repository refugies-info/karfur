import { DeleteResult } from "../../types/interface";
import { Widget, WidgetId, WidgetModel } from "../../typegoose";

export const getAllWidgets = async () => {
  return WidgetModel.find()
    .populate<{ author: { username: string | undefined, email: string } }>("author", "username email")
    .sort({ created_at: -1 });
};

export const createWidget = async (widget: Widget) => {
  return new WidgetModel(widget)
    .save()
    .then((w) => w.populate<{ author: { username: string | undefined, email: string } }>("author", "username email"));
};

export const updateWidget = async (widgetId: WidgetId, widget: Partial<Widget>) => {
  return WidgetModel.findOneAndUpdate({ _id: widgetId }, widget, { upsert: true, new: true })
    .populate<{ author: { username: string | undefined, email: string } }>("author", "username email");
};

export const deleteWidgetById = async (widgetId: WidgetId): Promise<DeleteResult> => {
  return WidgetModel.deleteOne({ _id: widgetId });
};
