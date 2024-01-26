import { DispositifStatus, RoleName } from "@refugies-info/api-types";
import { DispositifModel, ObjectId, Role, RoleModel, UserModel, StructureModel } from "../../typegoose";
import { dispositif as refDispositif } from "../../__fixtures__/dispositif";
import { user as refUser } from "../../__fixtures__/user";
import { structure as refStructure } from "../../__fixtures__/structure";
import { checkUserIsAuthorizedToModifyDispositif, checkUserIsAuthorizedToDeleteDispositif } from "../checkAuthorizations";

const adminRole = new RoleModel({ nom: RoleName.ADMIN });
const userAdmin = new UserModel(refUser);
userAdmin.roles = [adminRole];
const userNotAdmin = new UserModel(refUser);

const CURRENT_USER_ID = new ObjectId("6569af9815c38bd134125ff3");
const OTHER_USER_ID1 = new ObjectId("6569af9815c38bd134125ff4");
const OTHER_USER_ID2 = new ObjectId("6569af9815c38bd134125ff5");
const memberDetails = { added_at: new Date(), roles: ["contributeur"] };

describe("checkAuthorizations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("checkUserIsAuthorizedToModifyDispositif", () => {
    it("should return true if status Brouillon and user admin", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.mainSponsor = new StructureModel(refStructure);
      dispositif.status = DispositifStatus.DRAFT;

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status Brouillon and user author", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.mainSponsor = new StructureModel(refStructure);
      dispositif.status = DispositifStatus.DRAFT;
      dispositif.creatorId = CURRENT_USER_ID;

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente and user admin", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.mainSponsor = new StructureModel(refStructure);
      dispositif.status = DispositifStatus.WAITING_STRUCTURE;

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente and user author", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.mainSponsor = new StructureModel(refStructure);
      dispositif.status = DispositifStatus.WAITING_STRUCTURE;
      dispositif.creatorId = CURRENT_USER_ID;

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente and user not author but member of structure", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.status = DispositifStatus.WAITING_STRUCTURE;
      dispositif.creatorId = OTHER_USER_ID1;
      const structure = refStructure;
      structure.membres = [{ userId: OTHER_USER_ID2, ...memberDetails }, { userId: CURRENT_USER_ID, ...memberDetails }];
      dispositif.mainSponsor = new StructureModel(structure);

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente admin and user admin", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.mainSponsor = new StructureModel(refStructure);
      dispositif.status = DispositifStatus.WAITING_ADMIN;

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente admin and user in structure", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.status = DispositifStatus.WAITING_ADMIN;
      dispositif.creatorId = OTHER_USER_ID1;
      const structure = refStructure;
      structure.membres = [{ userId: OTHER_USER_ID2, ...memberDetails }, { userId: CURRENT_USER_ID, ...memberDetails }];
      dispositif.mainSponsor = new StructureModel(structure);

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status Brouillon de travail and user not author", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.status = DispositifStatus.DRAFT;
      dispositif.creatorId = OTHER_USER_ID1;
      const structure = refStructure;
      structure.membres = [{ userId: OTHER_USER_ID2, ...memberDetails }, { userId: CURRENT_USER_ID, ...memberDetails }];
      dispositif.mainSponsor = new StructureModel(structure);

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        true
      );
      expect(result).toBe(true);
    });
    it("should return true if status Brouillon de travail and user author", () => {

      const dispositif = new DispositifModel(refDispositif);
      dispositif.status = DispositifStatus.DRAFT;
      dispositif.creatorId = CURRENT_USER_ID;
      const structure = refStructure;
      structure.membres = [{ userId: OTHER_USER_ID2, ...memberDetails }, { userId: CURRENT_USER_ID, ...memberDetails }];
      dispositif.mainSponsor = new StructureModel(structure);

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        true
      );
      expect(result).toBe(true);
    });

    it("should throw if status En attente admin and user not in structure", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.status = DispositifStatus.WAITING_ADMIN;
      dispositif.creatorId = CURRENT_USER_ID;
      const structure = refStructure;
      structure.membres = [{ userId: OTHER_USER_ID2, ...memberDetails }, { userId: OTHER_USER_ID1, ...memberDetails }];
      dispositif.mainSponsor = new StructureModel(structure);

      try {
        checkUserIsAuthorizedToModifyDispositif(
          dispositif,
          userNotAdmin,
          false
        );
      } catch (error) {
        expect(error.message).toBe("The user is not authorized to edit content");
      }
      expect.assertions(1);
    });

    it("should return true if status Actif and user admin", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.mainSponsor = new StructureModel(refStructure);
      dispositif.status = DispositifStatus.ACTIVE;

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status Actif and user in structure", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.status = DispositifStatus.WAITING_ADMIN;
      dispositif.creatorId = OTHER_USER_ID1;
      const structure = refStructure;
      structure.membres = [{ userId: OTHER_USER_ID2, ...memberDetails }, { userId: CURRENT_USER_ID, ...memberDetails }];
      dispositif.mainSponsor = new StructureModel(structure);

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should throw if status Actif and user not in structure", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.status = DispositifStatus.ACTIVE;
      dispositif.creatorId = CURRENT_USER_ID;
      const structure = refStructure;
      structure.membres = [{ userId: OTHER_USER_ID2, ...memberDetails }, { userId: OTHER_USER_ID1, ...memberDetails }];
      dispositif.mainSponsor = new StructureModel(structure);

      try {
        checkUserIsAuthorizedToModifyDispositif(
          dispositif,
          userNotAdmin,
          false
        );
      } catch (error) {
        expect(error.message).toBe("The user is not authorized to edit content");
      }
      expect.assertions(1);
    });

    it("should return true if status Rejeté structure and user admin", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.mainSponsor = new StructureModel(refStructure);
      dispositif.status = DispositifStatus.KO_STRUCTURE;

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status Rejeté structure and user author", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.mainSponsor = new StructureModel(refStructure);
      dispositif.status = DispositifStatus.KO_STRUCTURE;
      dispositif.creatorId = CURRENT_USER_ID;

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status Rejeté and user not author but in structure", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.status = DispositifStatus.KO_STRUCTURE;
      dispositif.creatorId = OTHER_USER_ID1;
      const structure = refStructure;
      structure.membres = [{ userId: OTHER_USER_ID2, ...memberDetails }, { userId: CURRENT_USER_ID, ...memberDetails }];
      dispositif.mainSponsor = new StructureModel(structure);

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
      );

      expect(result).toBe(true);

    });

    it("should return true if status Supprimé and user admin", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.mainSponsor = new StructureModel(refStructure);
      dispositif.status = DispositifStatus.DELETED;

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });
  });

  describe("checkUserIsAuthorizedToDeleteDispositif", () => {
    it("should return true if user admin", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.mainSponsor = new StructureModel(refStructure);
      dispositif.creatorId = OTHER_USER_ID1;

      const result = checkUserIsAuthorizedToDeleteDispositif(
        dispositif,
        userAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if user responsable of structure", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.creatorId = OTHER_USER_ID1;
      const structure = refStructure;
      structure.membres = [
        { userId: CURRENT_USER_ID, added_at: new Date(), roles: ["contributeur", "administrateur"] },
        { userId: OTHER_USER_ID2, added_at: new Date(), roles: ["contributeur"] }
      ];
      dispositif.mainSponsor = new StructureModel(structure);

      const result = checkUserIsAuthorizedToDeleteDispositif(
        dispositif,
        userNotAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if user redacteur of structure and author", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.creatorId = CURRENT_USER_ID;
      const structure = refStructure;
      structure.membres = [
        { userId: CURRENT_USER_ID, added_at: new Date(), roles: ["contributeur"] },
        { userId: OTHER_USER_ID2, added_at: new Date(), roles: ["contributeur"] }
      ];
      dispositif.mainSponsor = new StructureModel(structure);

      const result = checkUserIsAuthorizedToDeleteDispositif(
        dispositif,
        userNotAdmin
      );
      expect(result).toBe(true);
    });

    it("should throw if user not in structure", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.creatorId = OTHER_USER_ID1;
      const structure = refStructure;
      structure.membres = [
        { userId: OTHER_USER_ID1, added_at: new Date(), roles: ["contributeur"] },
        { userId: OTHER_USER_ID2, added_at: new Date(), roles: ["contributeur"] }
      ];
      dispositif.mainSponsor = new StructureModel(structure);

      try {
        checkUserIsAuthorizedToDeleteDispositif(
          dispositif,
          userNotAdmin
        );
      } catch (error) {
        expect(error.message).toBe("NOT_AUTHORIZED");
      }
      expect.assertions(1);
    });

    it("should throw if redacteur but not author", () => {
      const dispositif = new DispositifModel(refDispositif);
      dispositif.creatorId = OTHER_USER_ID1;
      const structure = refStructure;
      structure.membres = [
        { userId: CURRENT_USER_ID, added_at: new Date(), roles: ["contributeur"] },
        { userId: OTHER_USER_ID2, added_at: new Date(), roles: ["contributeur"] }
      ];
      dispositif.mainSponsor = new StructureModel(structure);

      try {
        checkUserIsAuthorizedToDeleteDispositif(
          dispositif,
          userNotAdmin
        );
      } catch (error) {
        expect(error.message).toBe("NOT_AUTHORIZED");
      }
      expect.assertions(1);
    });
  });
});
