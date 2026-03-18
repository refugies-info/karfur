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
  });

  describe("user-level preferences (USER_PREFS)", () => {
    it("should respect user-level preferences from USER_PREFS", async () => {
      // AGIR user has DEFAULT_MAIL_PREFS which blocks newUserWelcome
      const result = await consentsToEmail(AGIR_USER_ID, "newUserWelcome");
      expect(result).toBe(DEFAULT_MAIL_PREFS.newUserWelcome);
    });

    it("should allow resetPassword for AGIR user", async () => {
      const result = await consentsToEmail(AGIR_USER_ID, "resetPassword");
      expect(result).toBe(DEFAULT_MAIL_PREFS.resetPassword);
    });
  });

  describe("structure-level preferences (STRUCTURE_PREFS)", () => {
    it("should block restricted templates when structureId is passed directly", async () => {
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

  describe("priority: user-level vs structure-level", () => {
    it("should check user-level prefs first, before structure lookup", async () => {
      // AGIR user exists in USER_PREFS - should NOT query DB
      const result = await consentsToEmail(AGIR_USER_ID, "newUserWelcome");
      expect(result).toBe(false);
      expect(StructureModel.find).not.toHaveBeenCalled();
    });
  });
});
