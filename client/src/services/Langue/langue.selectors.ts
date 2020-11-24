import { RootState } from "../rootReducer";

export const langueSelector = (state: RootState): string => state.langue.languei18nCode;
