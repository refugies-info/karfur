import { Widget, WidgetId, WidgetModel } from "src/typegoose";

export const getAllWidgets = async () => {
  return WidgetModel.find().populate("author", "username").populate("themes").sort({ created_at: -1 });
};

export const createWidget = async (widget: Widget) => {
  return new WidgetModel(widget)
    .save()
    .then((w) => w.populate("author", "username"))
    .then((w) => w.populate("themes"));
};

export const updateWidget = async (widgetId: WidgetId, widget: Partial<Widget>) => {
  return WidgetModel.findOneAndUpdate({ _id: widgetId }, widget, { upsert: true, new: true })
    .populate("author", "username")
    .populate("themes");
};

export const deleteWidgetById = async (widgetId: WidgetId) => {
  return WidgetModel.deleteOne({ _id: widgetId });
};
