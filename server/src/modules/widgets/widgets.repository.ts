import { Widget, WidgetDoc } from "../../schema/schemaWidget";

export const getAllWidgets = async () => {
  return Widget.find()
    .populate("author", "username")
    .sort({ created_at: -1 });
}

export const createWidget = async (widget: WidgetDoc) => {
  return new Widget(widget).save();
}
