import { consentsToEmail } from "../helpers";

const MENS_ID = "63985164fd1bf4e22792ef6e" as any;
const UNKNOWN_ID = "000000000000000000000000" as any;

describe("consentsToEmail - réseau MENS restrictions", () => {
  it("should block restricted templates (e.g. newUserWelcome)", () => {
    expect(consentsToEmail(MENS_ID, "newUserWelcome")).toBe(false);
  });

  it("should allow permitted templates (e.g. resetPassword)", () => {
    expect(consentsToEmail(MENS_ID, "resetPassword")).toBe(true);
  });

  it("should allow publishedFicheToStructureMembers", () => {
    expect(consentsToEmail(MENS_ID, "publishedFicheToStructureMembers")).toBe(true);
  });

  it("should block newMember", () => {
    expect(consentsToEmail(MENS_ID, "newMember")).toBe(false);
  });

  it("should default to true for unknown structure IDs", () => {
    expect(consentsToEmail(UNKNOWN_ID, "newUserWelcome")).toBe(true);
  });
});
