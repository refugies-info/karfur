import { testUser } from "../../../__fixtures__/user";
import { fetchUserActionCreator, setUserActionCreator } from "../user.actions";
import { FETCH_USER, SET_USER } from "../user.actionTypes";

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
