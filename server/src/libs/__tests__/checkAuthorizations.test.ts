// @ts-nocheck
import { checkUserIsAuthorizedToModifyDispositif, checkUserIsAuthorizedToDeleteDispositif } from "../checkAuthorizations";

// TODO: rewrite
describe.skip("checkAuthorizations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("checkUserIsAuthorizedToModifyDispositif", () => {
    const userAdmin = { _id: "userId", isAdmin: () => true };
    const userNotAdmin = { _id: "userId", isAdmin: () => false };
    it("should return true if status Brouillon and user admin", () => {
      const dispositif = { status: "Brouillon" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status Brouillon and user author", () => {
      const dispositif = { status: "Brouillon", creatorId: "userId" };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente and user admin", () => {
      const dispositif = { status: "En attente" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente and user author", () => {
      const dispositif = { status: "En attente", creatorId: "userId" };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
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
          userNotAdmin,
          false
        );
      } catch (error) {
        expect(error.message).toBe("The user is not authorized to edit content");
      }
      expect.assertions(1);
    });

    it("should return true if status En attente admin and user admin", () => {
      const dispositif = { status: "En attente admin" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status En attente admin and user in structure", () => {
      const mainSponsor = { membres: [{ userId: "membre1" }, { userId: "userId" }] };
      const dispositif = {
        status: "En attente admin",
        creatorId: "userId1",
        getMainSponsor: () => {
          return mainSponsor
        },
        mainSponsor,
      };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status Brouillon de travail and user not author", () => {
      const mainSponsor = {
        membres: [{ userId: "membre1" }, { userId: "userId" }],
      },
      const dispositif = {
        status: "Brouillon", creatorId: "userId2",
        getMainSponsor: () => {
          return mainSponsor
        },
        mainSponsor
      };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        true
      );
      expect(result).toBe(true);
    });
    it("should return true if status Brouillon de travail and user author", () => {
      const mainSponsor = {
        membres: [{ userId: "membre1" }, { userId: "userId" }],
      },
      const dispositif = {
        status: "Brouillon", creatorId: "userId",
        getMainSponsor: () => {
          return mainSponsor
        },
        mainSponsor
      };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        true
      );
      expect(result).toBe(true);
    });

    it("should throw if status En attente admin and user not in structure", () => {
      const mainSponsor = {
        membres: [{ userId: "membre1" }, { userId: "userId1" }],
      },
      const dispositif = {
        status: "En attente admin",
        creatorId: "userId",
        getMainSponsor: () => {
          return mainSponsor
        },
        mainSponsor
      };
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
      const dispositif = { status: "Actif" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status Actif and user in structure", () => {
      const mainSponsor = { membres: [{ userId: "membre1" }, { userId: "userId" }] };
      const dispositif = {
        status: "En attenteadmin",
        creatorId: "userId1",
        getMainSponsor: () => {
          return mainSponsor
        },
        mainSponsor
      };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should throw if status Actif and user not in structure", () => {
      const mainSponsor = {
        membres: [{ userId: "membre1" }, { userId: "userId1" }],
      };
      const dispositif = {
        status: "Actif",
        creatorId: "userId",
        getMainSponsor: () => {
          return mainSponsor
        },
        mainSponsor
      };
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
      const dispositif = { status: "Rejeté structure" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should return true if status Rejeté structure and user author", () => {
      const dispositif = { status: "Rejeté structure", creatorId: "userId" };
      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userNotAdmin,
        false
      );
      expect(result).toBe(true);
    });

    it("should throw if status Rejeté and user not author", () => {
      const mainSponsor = {
        membres: [{ userId: "membre1" }, { userId: "userId" }],
      },
      const dispositif = {
        status: "Rejeté structure",
        creatorId: "userId1",
        getMainSponsor: () => {
          return mainSponsor
        },
        mainSponsor
      };
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

    it("should return true if status Supprimé and user admin", () => {
      const dispositif = { status: "Supprimé" };

      const result = checkUserIsAuthorizedToModifyDispositif(
        dispositif,
        userAdmin,
        false
      );
      expect(result).toBe(true);
    });
  });

  describe("checkUserIsAuthorizedToDeleteDispositif", () => {
    const userAdmin = { _id: "userId", isAdmin: () => true };
    const userNotAdmin = { _id: "userId", isAdmin: () => false };

    it("should return true if user admin", () => {
      const dispositif = {
        creatorId: "otherUser",
      };

      const result = checkUserIsAuthorizedToDeleteDispositif(
        dispositif,
        userAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if user responsable of structure", () => {
      const mainSponsor = {
        creatorId: "otherUser",
        membres: [
          { userId: "userId", roles: ["contributeur", "administrateur"] },
          { userId: "userId2", roles: ["contributeur"] }
        ],
      }
      const dispositif = {
        getMainSponsor: () => {
          return mainSponsor
        },
        mainSponsor
      };

      const result = checkUserIsAuthorizedToDeleteDispositif(
        dispositif,
        userNotAdmin
      );
      expect(result).toBe(true);
    });

    it("should return true if user redacteur of structure and author", () => {
      const mainSponsor = {
        membres: [
          { userId: "userId", roles: ["contributeur"] },
          { userId: "userId2", roles: ["contributeur"] }
        ],
      }
      const dispositif = {
        creatorId: "userId",
        getMainSponsor: () => {
          return mainSponsor
        },
        mainSponsor
      };

      const result = checkUserIsAuthorizedToDeleteDispositif(
        dispositif,
        userNotAdmin
      );
      expect(result).toBe(true);
    });

    it("should throw if user not in structure", () => {
      const mainSponsor = {
        membres: [
          { userId: "userId1", roles: ["contributeur"] },
          { userId: "userId2", roles: ["contributeur"] }
        ],
      },
      const dispositif = {
        creatorId: "otherUser",
        getMainSponsor: () => {
          return mainSponsor
        },
        mainSponsor
      };
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
      const mainSponsor = {
        membres: [
          { userId: "userId", roles: ["contributeur"] },
          { userId: "userId2", roles: ["contributeur"] }
        ],
      };
      const dispositif = {
        creatorId: "otherUser",
        getMainSponsor: () => mainSponsor,
        mainSponsor
      };
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
