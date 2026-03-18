import type { StructureId, UserId } from "@refugies-info/mongo";
import { DEFAULT_MAIL_PREFS, STRUCTURE_PREFS, USER_PREFS } from "../data";
import { consentsToEmail } from "../helpers";

// Test IDs
const MENS_STRUCTURE_ID = "63985164fd1bf4e22792ef6e" as unknown as StructureId;
const MENS_MEMBER_USER_ID = "mens_member_user_id" as unknown as UserId;
const AGIR_USER_ID = "65f8245fd9babd17f5825aac" as unknown as UserId;
const UNKNOWN_USER_ID = "000000000000000000000000" as unknown as UserId;
const UNKNOWN_STRUCTURE_ID = "000000000000000000000001" as unknown as StructureId;

// Mock StructureModel.findOne
const mockLean = jest.fn();
const mockFindOne = jest.fn();

jest.mock("@refugies-info/mongo", () => ({
  ...jest.requireActual("@refugies-info/mongo"),
  StructureModel: {
    findOne: jest.fn(() => ({ lean: mockLean })),
  },
}));

// Import after mock
import { StructureModel } from "@refugies-info/mongo";

describe("consentsToEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: user is NOT a member
    mockLean.mockResolvedValue(null);
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
    it("should block when user is member and structure-level preference is false", async () => {
      // User IS a member of MENS
      mockLean.mockResolvedValue({ _id: MENS_STRUCTURE_ID });

      const result = await consentsToEmail(
        MENS_MEMBER_USER_ID,
        "publishedFicheToStructureMembers",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(false);
    });

    it("should block publishedFicheToCreator for MENS member", async () => {
      mockLean.mockResolvedValue({ _id: MENS_STRUCTURE_ID });

      const result = await consentsToEmail(
        MENS_MEMBER_USER_ID,
        "publishedFicheToCreator",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(false);
    });

    it("should allow resetPassword for MENS member (transactional)", async () => {
      mockLean.mockResolvedValue({ _id: MENS_STRUCTURE_ID });

      const result = await consentsToEmail(MENS_MEMBER_USER_ID, "resetPassword", MENS_STRUCTURE_ID);
      expect(result).toBe(true);
    });

    it("should block ficheArchived for MENS member", async () => {
      mockLean.mockResolvedValue({ _id: MENS_STRUCTURE_ID });

      const result = await consentsToEmail(MENS_MEMBER_USER_ID, "ficheArchived", MENS_STRUCTURE_ID);
      expect(result).toBe(false);
    });
  });

  describe("veto logic: any false blocks the email", () => {
    it("should block when user-level is false, even if structure-level would allow", async () => {
      // AGIR user has newUserWelcome=false in USER_PREFS
      const result = await consentsToEmail(AGIR_USER_ID, "newUserWelcome", UNKNOWN_STRUCTURE_ID);
      expect(result).toBe(false);
    });

    it("should block when structure-level is false and user is member", async () => {
      mockLean.mockResolvedValue({ _id: MENS_STRUCTURE_ID });

      const result = await consentsToEmail(
        MENS_MEMBER_USER_ID,
        "publishedFicheToStructureMembers",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(false);
    });
  });

  describe("membership verification", () => {
    it("should NOT apply structure prefs if user is NOT a member", async () => {
      // User is NOT a member of MENS (default mock returns null)
      // Even though MENS blocks publishedFicheToStructureMembers, user should get the email
      const result = await consentsToEmail(
        UNKNOWN_USER_ID,
        "publishedFicheToStructureMembers",
        MENS_STRUCTURE_ID,
      );
      expect(result).toBe(true);
    });

    it("should query membership when structureId is provided", async () => {
      await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome", MENS_STRUCTURE_ID);
      expect(StructureModel.findOne).toHaveBeenCalledWith(
        { _id: MENS_STRUCTURE_ID.toString(), "membres.userId": UNKNOWN_USER_ID.toString() },
        { _id: 1 },
      );
    });

    it("should NOT query DB when structureId is not provided", async () => {
      await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome");
      expect(StructureModel.findOne).not.toHaveBeenCalled();
    });
  });

  describe("default behavior", () => {
    it("should default to true for unknown users without structureId", async () => {
      const result = await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome");
      expect(result).toBe(true);
    });

    it("should default to true for unknown users with unknown structureId (not a member)", async () => {
      const result = await consentsToEmail(UNKNOWN_USER_ID, "newUserWelcome", UNKNOWN_STRUCTURE_ID);
      expect(result).toBe(true);
    });
  });

  describe("performance: skip DB query when user-level blocks", () => {
    it("should not query DB when user-level preference is false", async () => {
      // AGIR user has newUserWelcome=false in USER_PREFS - should NOT query DB
      const result = await consentsToEmail(AGIR_USER_ID, "newUserWelcome");
      expect(result).toBe(false);
      expect(StructureModel.findOne).not.toHaveBeenCalled();
    });
  });
});
