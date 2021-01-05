import { RootState } from "../rootReducer";
import { SimplifiedUser } from "../../types/interface";

export const allUserssSelector = (state: RootState): SimplifiedUser[] =>
  state.users;
