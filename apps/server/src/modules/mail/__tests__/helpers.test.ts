import type { StructureId, UserId } from "@refugies-info/mongo";
import { DEFAULT_MAIL_PREFS, STRUCTURE_PREFS, USER_PREFS } from "../data";
import { consentsToEmail } from "../helpers";

// Test IDs
const MENS_STRUCTURE_ID = "63985164fd1bf4e22792ef6e" as unknown as StructureId;
const AGIR_USER_ID = "65f8245fd9babd17f5825aac" as unknown as UserId;
const UNKNOWN_USER_ID = "000000000000000000000000" as unknown as UserId;
const UNKNOWN_STRUCTURE_ID = "000000000000000000000001" as unknown as StructureId;

describe("consentsToEmail", () => {
  describe("user-level preferences (USER_PREFS)", () => {
    it("should block when user-level preference is false", async () => {
      // AGIR user has DEFAULT_MAIL_PREFS which blocks newUserWelcome
      const result = await consentsToEmail(AGIR_USER_ID, "newUserWelcome");
      expect(result).toBe(false);
    });

    it("should allow when user-level preference is true", async () => {
      const result = await consentsToEmail(AGIR_USER_ID, "resetPassword");
      expect(result).toBe(true);
    });
  });

  describe("structure-level preferences (STRUCTURE_PREFS)", () => {
    it("should block when structure-level preference is false (regardless of membership)", async () => {
      // MENS blocks validatedAndPublished by default
      const result = await consentsToEmail(
        UNKNOWN_USER_ID,
        "validatedAndPublished",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(false);
    });

    it("should block publishedFicheToStructureMembers for MENS", async () => {
      const result = await consentsToEmail(
        UNKNOWN_USER_ID,
        "publishedFicheToStructureMembers",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(false);
    });

    it("should block publishedFicheToCreator for MENS", async () => {
      const result = await consentsToEmail(
        UNKNOWN_USER_ID,
        "publishedFicheToCreator",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(false);
    });

    it("should allow resetPassword for MENS (transactional)", async () => {
      const result = await consentsToEmail(UNKNOWN_USER_ID, "resetPassword", MENS_STRUCTURE_ID);
      expect(result).toBe(true);
    });

    it("should block ficheArchived for MENS", async () => {
      const result = await consentsToEmail(UNKNOWN_USER_ID, "ficheArchived", MENS_STRUCTURE_ID);
      expect(result).toBe(false);
    });

    it("should allow when structureId is provided but no pref exists for that template", async () => {
      // Unknown structure has no prefs
      const result = await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome", UNKNOWN_STRUCTURE_ID);
      expect(result).toBe(true);
    });
  });

  describe("veto logic: any false blocks the email", () => {
    it("should block when user-level is false, even if structure-level would allow", async () => {
      // AGIR user has newUserWelcome=false in USER_PREFS
      const result = await consentsToEmail(AGIR_USER_ID, "newUserWelcome", UNKNOWN_STRUCTURE_ID);
      expect(result).toBe(false);
    });

    it("should block when structure-level is false", async () => {
      const result = await consentsToEmail(
        UNKNOWN_USER_ID,
        "publishedFicheToStructureMembers",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(false);
    });
  });

  describe("no structureId provided", () => {
    it("should skip structure-level check when no structureId", async () => {
      const result = await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome");
      expect(result).toBe(true);
    });

    it("should still check user-level prefs when no structureId", async () => {
      const result = await consentsToEmail(AGIR_USER_ID, "newUserWelcome");
      expect(result).toBe(false);
    });
  });

  describe("default behavior", () => {
    it("should default to true for unknown users without structureId", async () => {
      const result = await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome");
      expect(result).toBe(true);
    });

    it("should default to true for unknown users with unknown structureId", async () => {
      const result = await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome", UNKNOWN_STRUCTURE_ID);
      expect(result).toBe(true);
    });
  });
});

/**
 * RI-1154: Regression test for MENS members receiving validatedAndPublished emails
 *
 * These tests verify that the MENS email blocking logic is working.
 * The key insight: structure-level prefs apply REGARDLESS of membership.
 */
describe("RI-1154: validatedAndPublished should be blocked for MENS", () => {
  it("should block validatedAndPublished for MENS (regression test)", async () => {
    // This is the email that was incorrectly sent (subject: "Les mises à jour de votre fiche ont été publiées")
    const result = await consentsToEmail(
      UNKNOWN_USER_ID,
      "validatedAndPublished",
      MENS_STRUCTURE_ID,
    );

    // Should be BLOCKED - MENS inherits validatedAndPublished: false from DEFAULT_MAIL_PREFS
    expect(result).toBe(false);
  });

  it("should block validatedAndPublished for actual MENS member user ID from production", async () => {
    // Using the actual user ID from production incident: 64aad4d22e7872e398e7b8cd
    const actualMensMemberId = "64aad4d22e7872e398e7b8cd" as unknown as UserId;

    const result = await consentsToEmail(
      actualMensMemberId,
      "validatedAndPublished",
      MENS_STRUCTURE_ID,
    );

    expect(result).toBe(false);
  });

  it("should verify validatedAndPublished is false in DEFAULT_MAIL_PREFS", () => {
    // This documents that validatedAndPublished should be blocked by default
    expect(DEFAULT_MAIL_PREFS.validatedAndPublished).toBe(false);
  });

  it("should verify MENS structure inherits validatedAndPublished: false", () => {
    // MENS STRUCTURE_PREFS spreads DEFAULT_MAIL_PREFS, so it should inherit the false value
    const mensPrefs = STRUCTURE_PREFS["63985164fd1bf4e22792ef6e"];
    expect(mensPrefs).toBeDefined();
    expect(mensPrefs.validatedAndPublished).toBe(false);
  });
});
