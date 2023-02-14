import { Widget, WidgetId, WidgetModel } from "src/typegoose";

export const getAllWidgets = async () => {
  return WidgetModel.find()
    .populate<{ author: { username: string } }>("author", "username")
    .sort({ created_at: -1 });
};

export const createWidget = async (widget: Widget) => {
  return new WidgetModel(widget)
    .save()
    .then((w) => w.populate<{ author: { username: string } }>("author", "username"));
};

export const updateWidget = async (widgetId: WidgetId, widget: Partial<Widget>) => {
  return WidgetModel.findOneAndUpdate({ _id: widgetId }, widget, { upsert: true, new: true })
    .populate<{ author: { username: string } }>("author", "username");
};

export const deleteWidgetById = async (widgetId: WidgetId) => {
  return WidgetModel.deleteOne({ _id: widgetId });
};
