import type { GetDispositifResponse, Languages } from "@refugies-info/api-types";
import type { RootState } from "../reducers";

export const selectedContentSelector =
  (langue: Languages | null) =>
  (state: RootState): GetDispositifResponse | null => {
    if (!langue) return null;
    return state.selectedContent[langue];
  };
