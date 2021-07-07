import { selectedContentReducer } from "../selectedContent.reducer";
import { setSelectedContentActionCreator } from "../selectedContent.actions";

describe("[Reducer] selected content", () => {
  it("sets the content to the store", () => {
    const state = {
      ar: null,
      fr: null,
      en: null,
      ps: null,
      fa: null,
      "ti-ER": null,
      ru: null,
    };
    expect(
      selectedContentReducer(
        state,
        setSelectedContentActionCreator({ content: "content", locale: "ar" })
      )
    ).toEqual({
      ar: "content",
      fr: null,
      en: null,
      ps: null,
      fa: null,
      "ti-ER": null,
      ru: null,
    });
  });
});
