import type { StructureId, UserId } from "@refugies-info/mongo";
import { DEFAULT_MAIL_PREFS, STRUCTURE_PREFS, USER_PREFS } from "../data";
import { consentsToEmail } from "../helpers";

// Test IDs
const MENS_STRUCTURE_ID = "63985164fd1bf4e22792ef6e" as unknown as StructureId;
const MENS_MEMBER_USER_ID = "mens_member_user_id" as unknown as UserId;
const AGIR_USER_ID = "65f8245fd9babd17f5825aac" as unknown as UserId;
const UNKNOWN_USER_ID = "000000000000000000000000" as unknown as UserId;
const UNKNOWN_STRUCTURE_ID = "000000000000000000000001" as unknown as StructureId;

// Mock StructureModel
const mockLean = jest.fn();

jest.mock("@refugies-info/mongo", () => ({
  ...jest.requireActual("@refugies-info/mongo"),
  StructureModel: {
    find: jest.fn(() => ({ lean: mockLean })),
  },
}));

// Import after mock
import { StructureModel } from "@refugies-info/mongo";

describe("consentsToEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: return empty array (user has no structures)
    mockLean.mockResolvedValue([]);
  });

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
    it("should block when structure-level preference is false (via structureId param)", async () => {
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
      // Create a scenario where user has no prefs (would allow) but structure blocks
      // User has no entry in USER_PREFS, but MENS structure blocks publishedFicheToStructureMembers
      const result = await consentsToEmail(
        UNKNOWN_USER_ID,
        "publishedFicheToStructureMembers",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(false);
    });
  });

  describe("structure lookup (DB query)", () => {
    it("should query DB when structureId not provided and check structure prefs", async () => {
      // Mock user is member of MENS structure
      mockLean.mockResolvedValue([{ _id: MENS_STRUCTURE_ID }]);

      const result = await consentsToEmail(MENS_MEMBER_USER_ID, "publishedFicheToStructureMembers");
      expect(result).toBe(false);
      expect(StructureModel.find).toHaveBeenCalledWith(
        { "membres.userId": MENS_MEMBER_USER_ID.toString() },
        { _id: 1 },
      );
    });

    it("should default to true for unknown structure IDs", async () => {
      mockLean.mockResolvedValue([{ _id: UNKNOWN_STRUCTURE_ID }]);

      const result = await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome");
      expect(result).toBe(true);
    });
  });

  describe("default behavior", () => {
    it("should default to true for unknown users without structures", async () => {
      mockLean.mockResolvedValue([]);

      const result = await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome");
      expect(result).toBe(true);
    });
  });

  describe("performance: skip DB query when user-level blocks", () => {
    it("should not query DB when user-level preference is false", async () => {
      // AGIR user has newUserWelcome=false in USER_PREFS - should NOT query DB
      const result = await consentsToEmail(AGIR_USER_ID, "newUserWelcome");
      expect(result).toBe(false);
      expect(StructureModel.find).not.toHaveBeenCalled();
    });

    it("should query DB when user has no preference to check structure-level", async () => {
      // Unknown user - should query DB to check structures
      await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome");
      expect(StructureModel.find).toHaveBeenCalled();
    });
  });
});
