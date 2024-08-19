import { StructureStatus } from "@refugies-info/api-types";
import { dispositif } from "../../../__fixtures__";
import * as repository from "../../../modules/dispositif/dispositif.repository";
import { ObjectId } from "../../../typegoose";
import { getAllDispositifs } from "./getAllDispositifs";

describe("getAllDispositifs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("should call getDispositifsFromDB", async () => {
    const expectedDispositif =
    {
      _id: new ObjectId("5ce7b52d83983700167bca27"),
      nbMercis: 0,
      hasDraftVersion: false,
      titreInformatif: "Apprendre le français",
      titreMarque: "Des mots d'ancrage",
      updatedAt: new Date("2023-12-07T14:25:30.108Z"),
      status: "Actif",
      typeContenu: "dispositif",
      creatorId: {
        _id: "id",
        username: "creator",
        email: "creator@test.com",
        picture: {
          imgId: "",
          public_id: "",
          secure_url: ""
        }
      },
      created_at: new Date("2023-12-01T10:05:56.577Z"),
      publishedAt: new Date("2023-12-01T14:34:29.335Z"),
      publishedAtAuthor: {
        _id: "id",
        username: "author",
      },
      adminComments: "comment",
      adminProgressionStatus: "comment",
      adminPercentageProgressionStatus: "comment",
      lastAdminUpdate: new Date("2023-12-01T14:34:29.335Z"),
      draftReminderMailSentDate: new Date("2023-12-01T14:34:29.335Z"),
      draftSecondReminderMailSentDate: new Date("2023-12-01T14:34:29.335Z"),
      lastReminderMailSentToUpdateContentDate: new Date("2023-12-01T14:34:29.335Z"),
      lastModificationDate: new Date("2023-12-01T14:34:29.335Z"),
      lastModificationAuthor: {
        _id: "id",
        username: "author",
      },
      needs: [
        new ObjectId("613721a409c5190dfa70d057"),
        new ObjectId("63450e79f14a373d5af284c0"),
        new ObjectId("613721a409c5190dfa70d064")
      ],
      theme: new ObjectId("63286a015d31b2c0cad9960a"),
      secondaryThemes: [
        new ObjectId("63286a015d31b2c0cad9960d"),
        new ObjectId("63450dd43e23cd7181ba0b26")
      ],
      nbVues: 79,
      nbMots: 256,
      mainSponsor: {
        _id: "id",
        nom: "sponsor",
        status: StructureStatus.ACTIVE,
        picture: {
          imgId: "",
          public_id: "",
          secure_url: ""
        }
      },
      themesSelectedByAuthor: false,
      webOnly: false
    };

    const populatedDispositif: any = dispositif;
    dispositif.hasDraftVersion = false;
    dispositif.lastAdminUpdate = new Date("2023-12-01T14:34:29.335Z");
    dispositif.draftReminderMailSentDate = new Date("2023-12-01T14:34:29.335Z");
    dispositif.draftSecondReminderMailSentDate = new Date("2023-12-01T14:34:29.335Z");
    dispositif.lastReminderMailSentToUpdateContentDate = new Date("2023-12-01T14:34:29.335Z");
    dispositif.lastModificationDate = new Date("2023-12-01T14:34:29.335Z");
    dispositif.adminComments = "comment";
    dispositif.adminPercentageProgressionStatus = "comment";
    dispositif.adminProgressionStatus = "comment";
    populatedDispositif.mainSponsor = {
      _id: "id",
      nom: "sponsor",
      status: StructureStatus.ACTIVE,
      picture: {
        imgId: "",
        public_id: "",
        secure_url: ""
      }
    }
    populatedDispositif.creatorId = {
      _id: "id",
      username: "creator",
      email: "creator@test.com",
      picture: {
        imgId: "",
        public_id: "",
        secure_url: ""
      }
    }
    populatedDispositif.lastModificationAuthor = {
      _id: "id",
      username: "author",
    }
    populatedDispositif.publishedAtAuthor = {
      _id: "id",
      username: "author",
    }

    const expectedResponse = {
      text: "success",
      data: [expectedDispositif, expectedDispositif]
    };
    const getDispositifsFromDBMock = jest.spyOn(repository, 'getDispositifsFromDB');
    getDispositifsFromDBMock.mockResolvedValue([populatedDispositif, populatedDispositif]);

    // Act
    const result = await getAllDispositifs();

    // Assert
    expect(getDispositifsFromDBMock).toHaveBeenCalled();
    expect(result).toEqual(expectedResponse);
  });
});
