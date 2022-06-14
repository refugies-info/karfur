import { RootState } from "../rootReducer";
import { Widget } from "../../types/interface";
import { ObjectId } from "mongodb";

export const widgetsSelector = (state: RootState): Widget[] => state.widgets;

export const widgetSelector = (widgetId: ObjectId | null) => (state: RootState) => {
  if (!widgetId) return null;
  const filteredState = state.widgets.filter((widget) => widget._id === widgetId);

  return filteredState.length > 0 ? filteredState[0] : null;
};
