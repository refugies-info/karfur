import { GetWidgetResponse, Id } from "@refugies-info/api-types";
import { RootState } from "../rootReducer";

export const widgetsSelector = (state: RootState): GetWidgetResponse[] => state.widgets;

export const widgetSelector = (widgetId: Id | null) => (state: RootState) => {
  if (!widgetId) return null;
  const filteredState = state.widgets.filter((widget) => widget._id === widgetId);

  return filteredState.length > 0 ? filteredState[0] : null;
};
