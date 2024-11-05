import { setLanguagesActionCreator } from "../languages.actions";
import { initialLanguageState, languagesReducer } from "../languages.reducer";

describe("[Reducer] languages", () => {
  it("sets the available languages to the store", () => {
    const state = initialLanguageState;
    expect(
      languagesReducer(
        state,
        setLanguagesActionCreator([
          {
            _id: "id1",
            langueFr: "",
            i18nCode: "",
            avancementTrad: 1,
            avancement: 1,
          },
          {
            _id: "id2",
            langueFr: "",
            i18nCode: "",
            avancementTrad: 1,
            avancement: 1,
          },
        ]),
      ),
    ).toEqual({
      availableLanguages: [
        {
          _id: "id1",
          langueFr: "",
          i18nCode: "",
          avancementTrad: 1,
          avancement: 1,
        },
        {
          _id: "id2",
          langueFr: "",
          i18nCode: "",
          avancementTrad: 1,
          avancement: 1,
        },
      ],
    });
  });
});
