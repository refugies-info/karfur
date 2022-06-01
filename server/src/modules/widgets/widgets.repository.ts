import { ObjectId } from "mongoose";
import { Widget, WidgetDoc } from "../../schema/schemaWidget";

export const getAllWidgets = async () => {
  return Widget.find()
    .populate("author", "username")
    .sort({ created_at: -1 });
}

export const createWidget = async (widget: WidgetDoc) => {
  return new Widget(widget).save();
}

export const updateWidget = async (widgetId: ObjectId, widget: Partial<WidgetDoc>) => {
  return Widget.findOneAndUpdate({ _id: widgetId }, widget, { upsert: true });
}

export const deleteWidgetById = async (widgetId: ObjectId) => {
  return Widget.deleteOne({ _id: widgetId });
}
