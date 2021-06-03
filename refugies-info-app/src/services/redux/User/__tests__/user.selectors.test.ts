import { initialRootStateFactory } from "../../reducers";
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
          hasUserSeenOnboarding: true,
          selectedLanguagei18nCode: "en",
        },
      };
      expect(hasUserSeenOnboardingSelector(state)).toEqual(true);
      expect(selectedI18nCodeSelector(state)).toEqual("en");
    });
  });
});
