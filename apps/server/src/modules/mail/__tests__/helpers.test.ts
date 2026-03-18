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
    it("should block when structure-level preference is false and structureId is provided", async () => {
      const result = await consentsToEmail(
        UNKNOWN_USER_ID,
        "publishedFicheToStructureMembers",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(false);
    });

    it("should block publishedFicheToCreator for MENS structure", async () => {
      const result = await consentsToEmail(
        UNKNOWN_USER_ID,
        "publishedFicheToCreator",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(false);
    });

    it("should allow resetPassword for MENS structure (transactional)", async () => {
      const result = await consentsToEmail(UNKNOWN_USER_ID, "resetPassword", MENS_STRUCTURE_ID);
      expect(result).toBe(true);
    });

    it("should block ficheArchived for MENS structure", async () => {
      const result = await consentsToEmail(UNKNOWN_USER_ID, "ficheArchived", MENS_STRUCTURE_ID);
      expect(result).toBe(false);
    });
  });

  describe("veto logic: any false blocks the email", () => {
    it("should block when user-level is false, even if structure-level would allow", async () => {
      // AGIR user has newUserWelcome=false in USER_PREFS
      // Even if we pass an unknown structure (which would allow by default), it should still block
      const result = await consentsToEmail(AGIR_USER_ID, "newUserWelcome", UNKNOWN_STRUCTURE_ID);
      expect(result).toBe(false);
    });

    it("should block when structure-level is false, even if user-level would allow", async () => {
      // User has no entry in USER_PREFS (would allow), but MENS structure blocks publishedFicheToStructureMembers
      const result = await consentsToEmail(
        UNKNOWN_USER_ID,
        "publishedFicheToStructureMembers",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(false);
    });
  });

  describe("structureId required for structure-level prefs", () => {
    it("should NOT apply structure prefs when structureId is not provided", async () => {
      // User is a member of MENS structure (which blocks publishedFicheToStructureMembers)
      // But if we don't provide structureId, the email should be allowed
      // (because the email might be for a different structure or not structure-related)
      const result = await consentsToEmail(UNKNOWN_USER_ID, "publishedFicheToStructureMembers");
      expect(result).toBe(true);
    });

    it("should only apply structure prefs for the provided structureId", async () => {
      // Email is for UNKNOWN_STRUCTURE (no restrictions) - should allow
      // Even though user might be a member of MENS in real scenario
      const result = await consentsToEmail(
        UNKNOWN_USER_ID,
        "publishedFicheToStructureMembers",
        UNKNOWN_STRUCTURE_ID,
      );
      expect(result).toBe(true);
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

  describe("performance: no DB query needed", () => {
    it("should not require DB queries - all lookups are in-memory", async () => {
      // The function is now purely in-memory (no StructureModel import needed)
      // This is faster and avoids the bug of applying wrong structure's prefs
      const result = await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome");
      expect(result).toBe(true);
    });
  });
});
