// @ts-nocheck
import { checkUserIsAuthorizedToModifyDispositif, checkUserIsAuthorizedToDeleteDispositif } from "../checkAuthorizations";

describe("checkAuthorizations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("checkUserIsAuthorizedToModifyDispositif", () => {
    const userRolesAdmin = [{ nom: "Admin" }];
    const userRolesNotAdmin = [{ nom: "User" }];
    it("should return true if status Brouillon and user admin", () => {
      const dispositif = { status: "Brouillon" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if status Brouillon and user author", () => {
      const dispositif = { status: "Brouillon", creatorId: "userId" };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesNotAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente and user admin", () => {
      const dispositif = { status: "En attente" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente and user author", () => {
      const dispositif = { status: "En attente", creatorId: "userId" };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesNotAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente and user not author", () => {
      const dispositif = {
        status: "En attente",
        creatorId: "userId1",
        mainSponsor: { membres: [{ userId: "membre1" }, { userId: "userId" }] },
      };

      try {
        checkUserIsAuthorizedToModifyDispositif(
          dispositif,
          "userId",
          userRolesNotAdmin
        );
      } catch (error) {
        expect(error.message).toBe("NOT_AUTHORIZED");
      }
      expect.assertions(1);
    });

    it("should return true if status En attente admin and user admin", () => {
      const dispositif = { status: "En attente admin" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente admin and user in structure", () => {
      const dispositif = {
        status: "En attente admin",
        creatorId: "userId1",
        mainSponsor: { membres: [{ userId: "membre1" }, { userId: "userId" }] },
      };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesNotAdmin
      );
      expect(result).toBe(true);
    });

    it("should throw if status En attente admin and user not in structure", () => {
      const dispositif = {
        status: "En attente admin",
        creatorId: "userId",
        mainSponsor: {
          membres: [{ userId: "membre1" }, { userId: "userId1" }],
        },
      };
      try {
        checkUserIsAuthorizedToModifyDispositif(
          dispositif,
          "userId",
          userRolesNotAdmin
        );
      } catch (error) {
        expect(error.message).toBe("NOT_AUTHORIZED");
      }
      expect.assertions(1);
    });

    it("should return true if status Actif and user admin", () => {
      const dispositif = { status: "Actif" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if status Actif and user in structure", () => {
      const dispositif = {
        status: "En attenteadmin",
        creatorId: "userId1",
        mainSponsor: { membres: [{ userId: "membre1" }, { userId: "userId" }] },
      };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesNotAdmin
      );
      expect(result).toBe(true);
    });

    it("should throw if status Actif and user not in structure", () => {
      const dispositif = {
        status: "Actif",
        creatorId: "userId",
        mainSponsor: {
          membres: [{ userId: "membre1" }, { userId: "userId1" }],
        },
      };
      try {
        checkUserIsAuthorizedToModifyDispositif(
          dispositif,
          "userId",
          userRolesNotAdmin
        );
      } catch (error) {
        expect(error.message).toBe("NOT_AUTHORIZED");
      }
      expect.assertions(1);
    });

    it("should return true if status Rejeté structure and user admin", () => {
      const dispositif = { status: "Rejeté structure" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if status Rejeté structure and user author", () => {
      const dispositif = { status: "Rejeté structure", creatorId: "userId" };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesNotAdmin
      );
      expect(result).toBe(true);
    });

    it("should throw if status Rejeté and user not author", () => {
      const dispositif = {
        status: "Rejeté structure",
        creatorId: "userId1",
        mainSponsor: {
          membres: [{ userId: "membre1" }, { userId: "userId" }],
        },
      };
      try {
        checkUserIsAuthorizedToModifyDispositif(
          dispositif,
          "userId",
          userRolesNotAdmin
        );
      } catch (error) {
        expect(error.message).toBe("NOT_AUTHORIZED");
      }
      expect.assertions(1);
    });

    it("should return true if status Supprimé and user admin", () => {
      const dispositif = { status: "Supprimé" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente non prioritaire and user admin", () => {
      const dispositif = { status: "En attente non prioritaire" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente non prioritaire and user author", () => {
      const dispositif = {
        status: "En attente non prioritaire",
        creatorId: "userId",
      };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        "userId",
        userRolesNotAdmin
      );
      expect(result).toBe(true);
    });
  });

  describe("checkUserIsAuthorizedToDeleteDispositif", () => {
    const userRolesAdmin = [{ nom: "Admin" }];
    const userRolesNotAdmin = [{ nom: "User" }];

    it("should return true if user admin", () => {
      const dispositif = {
        creatorId: "otherUser",
      };

      const result = checkUserIsAuthorizedToDeleteDispositif(
        dispositif,
        "userId",
        userRolesAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if user responsable of structure", () => {
      const dispositif = {
        mainSponsor: {
          creatorId: "otherUser",
          membres: [
            { userId: "userId", roles: ["contributeur", "administrateur"] },
            { userId: "userId2", roles: ["contributeur"] }
          ],
        },
      };

      const result = checkUserIsAuthorizedToDeleteDispositif(
        dispositif,
        "userId",
        userRolesNotAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if user redacteur of structure and author", () => {
      const dispositif = {
        creatorId: "userId",
        mainSponsor: {
          membres: [
            { userId: "userId", roles: ["contributeur"] },
            { userId: "userId2", roles: ["contributeur"] }
          ],
        },
      };

      const result = checkUserIsAuthorizedToDeleteDispositif(
        dispositif,
        "userId",
        userRolesNotAdmin
      );
      expect(result).toBe(true);
    });

    it("should throw if user not in structure", () => {
      const dispositif = {
        creatorId: "otherUser",
        mainSponsor: {
          membres: [
            { userId: "userId1", roles: ["contributeur"] },
            { userId: "userId2", roles: ["contributeur"] }
          ],
        },
      };
      try {
        checkUserIsAuthorizedToDeleteDispositif(
          dispositif,
          "userId",
          userRolesNotAdmin
        );
      } catch (error) {
        expect(error.message).toBe("NOT_AUTHORIZED");
      }
      expect.assertions(1);
    });

    it("should throw if redacteur but not author", () => {
      const dispositif = {
        creatorId: "otherUser",
        mainSponsor: {
          membres: [
            { userId: "userId", roles: ["contributeur"] },
            { userId: "userId2", roles: ["contributeur"] }
          ],
        },
      };
      try {
        checkUserIsAuthorizedToDeleteDispositif(
          dispositif,
          "userId",
          userRolesNotAdmin
        );
      } catch (error) {
        expect(error.message).toBe("NOT_AUTHORIZED");
      }
      expect.assertions(1);
    });
  });
});
