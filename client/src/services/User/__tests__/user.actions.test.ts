import {
  setUserActionCreator,
  fetchUserActionCreator,
  updateUserActionCreator,
} from "../user.actions";
import moment from "moment";
import { ObjectId } from "mongodb";
import { SET_USER, FETCH_USER, UPDATE_USER } from "../user.actionTypes";

describe("[Actions] User", () => {
  const date = moment("2019-05-01 12:00:00");
  const user = {
    username: "test",
    updatedAt: date,
    created_at: date,
    _id: new ObjectId("testObjectId"),
  };
  it("should return a SET_USER action with correct payload", () => {
    expect(setUserActionCreator(user)).toEqual({
      type: SET_USER,
      payload: user,
    });
  });

  it("should return a FETCH_USER action", () => {
    expect(fetchUserActionCreator()).toEqual({
      type: FETCH_USER,
    });
  });

  it("should return a UPDATE_USER action with correct payload", () => {
    expect(updateUserActionCreator(user)).toEqual({
      type: UPDATE_USER,
      payload: user,
    });
  });
});
