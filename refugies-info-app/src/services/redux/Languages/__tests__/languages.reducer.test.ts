import { languagesReducer } from "../languages.reducer";
import { setLanguagesActionCreator } from "../languages.actions";

describe("[Reducer] LoadingStatus", () => {
  it("sets the loading status to true to the store", () => {
    const state = {};
    expect(
      languagesReducer(
        state,
        setLanguagesActionCreator([{ _id: "id1" }, { _id: "id2" }])
      )
    ).toEqual({
      availableLanguages: [{ _id: "id1" }, { _id: "id2" }],
    });
  });
});
