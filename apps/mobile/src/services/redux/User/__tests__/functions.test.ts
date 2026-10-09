jest.mock("~/utils/API", () => ({ updateAppUser: jest.fn() }));

import { updateAppUser } from "~/utils/API";
import { deleteItemInAsyncStorage } from "../functions";

describe("deleteItemInAsyncStorage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("clears nullable API fields with null", async () => {
    await deleteItemInAsyncStorage("AGE");
    expect(updateAppUser).toHaveBeenCalledWith({ age: null });
  });

  it("clears the language with null", async () => {
    await deleteItemInAsyncStorage("SELECTED_LANGUAGE");
    expect(updateAppUser).toHaveBeenCalledWith({ selectedLanguage: null });
  });

  it("does not call the API for local-only items", async () => {
    await deleteItemInAsyncStorage("HAS_USER_SEEN_ONBOARDING");
    expect(updateAppUser).not.toHaveBeenCalled();
  });
});
