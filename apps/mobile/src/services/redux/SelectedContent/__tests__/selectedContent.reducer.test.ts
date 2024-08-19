import { selectedContentReducer } from "../selectedContent.reducer";
import { setSelectedContentActionCreator } from "../selectedContent.actions";
import { selectedContent } from "../../../../jest/__fixtures__/selectedContent";

describe("[Reducer] selected content", () => {
  it("sets the content to the store", () => {
    const state = {
      ar: null,
      fr: null,
      en: null,
      ps: null,
      fa: null,
      ti: null,
      ru: null,
      uk: null,
    };
    expect(
      selectedContentReducer(
        state,
        setSelectedContentActionCreator({ content: selectedContent, locale: "ar" })
      )
    ).toEqual({
      ar: selectedContent,
      fr: null,
      en: null,
      ps: null,
      fa: null,
      ti: null,
      ru: null,
      uk: null,
    });
  });
});
