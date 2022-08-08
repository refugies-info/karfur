import { AvailableLanguageI18nCode } from "../../../../types/interface";
import { initialRootStateFactory } from "../../reducers";
import { initialUserState } from "../user.reducer";
import {
  hasUserSeenOnboardingSelector,
  selectedI18nCodeSelector,
} from "../user.selectors";

describe("[Selector] user", () => {
  describe("[Selector] hasUserSeenOnboardingSelector", () => {
    it("selects the user hasUserSeenOnboardingSelector", () => {
      const state = {
        ...initialRootStateFactory(),
        user: {
          ...initialUserState,
          hasUserSeenOnboarding: false,
          selectedLanguagei18nCode: null,
        },
      };
      expect(hasUserSeenOnboardingSelector(state)).toEqual(false);
      expect(selectedI18nCodeSelector(state)).toEqual(null);
    });

    it("selects the user hasUserSeenOnboardingSelector", () => {
      const state = {
        ...initialRootStateFactory(),
        user: {
          ...initialUserState,
          hasUserSeenOnboarding: true,
          selectedLanguagei18nCode: "en" as AvailableLanguageI18nCode,
        },
      };
      expect(hasUserSeenOnboardingSelector(state)).toEqual(true);
      expect(selectedI18nCodeSelector(state)).toEqual("en");
    });
  });
});
