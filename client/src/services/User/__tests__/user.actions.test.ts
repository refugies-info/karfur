import {
  setUserActionCreator,
  fetchUserActionCreator,
} from "../user.actions";
import { SET_USER, FETCH_USER } from "../user.actionTypes";
import { testUser } from "../../../__fixtures__/user";

describe("[Actions] User", () => {
  it("should return a SET_USER action with correct payload", () => {
    expect(setUserActionCreator(testUser)).toEqual({
      type: SET_USER,
      payload: testUser,
    });
  });

  it("should return a FETCH_USER action", () => {
    expect(fetchUserActionCreator()).toEqual({
      type: FETCH_USER,
    });
  });
});
