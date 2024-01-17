import { DispositifStatus } from "@refugies-info/api-types";
import { updateDispositif } from "./updateDispositif";
import * as repository from "../../../modules/dispositif/dispositif.repository";
import * as service from "../../../modules/dispositif/dispositif.service";
import * as logDispositif from "../../../modules/dispositif/log";
import * as log from "./log";
import * as authorizations from "../../../libs/checkAuthorizations";
import { dispositif, structure, user } from "../../../__fixtures__";
import { DispositifModel, StructureModel, ObjectId } from "../../../typegoose";

jest.mock("airtable");
jest.mock("@sendgrid/mail");


describe("updateDispositif", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2023, 0, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("updates dispositif", async () => {
    const getDispositifByIdMock = jest.spyOn(repository, 'getDispositifById');
    const getDraftDispositifByIdMock = jest.spyOn(repository, 'getDraftDispositifById');
    const updateDispositifInDBMock = jest.spyOn(repository, 'updateDispositifInDB');
    const addNewParticipantMock = jest.spyOn(repository, 'addNewParticipant');
    const cloneDispositifInDraftsMock = jest.spyOn(repository, 'cloneDispositifInDrafts');
    const notifyChangeMock = jest.spyOn(service, 'notifyChange');
    const logContactMock = jest.spyOn(logDispositif, 'logContact');
    const checkUserIsAuthorizedToModifyDispositifMock = jest.spyOn(authorizations, 'checkUserIsAuthorizedToModifyDispositif');
    const logMock = jest.spyOn(log, 'log');

    const newDispositif = new DispositifModel(dispositif);
    newDispositif.status = DispositifStatus.DRAFT;
    newDispositif.mainSponsor = new StructureModel(structure);

    getDispositifByIdMock.mockResolvedValue(new DispositifModel(newDispositif));
    getDraftDispositifByIdMock.mockResolvedValue(null);
    addNewParticipantMock.mockResolvedValue(new DispositifModel(newDispositif));
    cloneDispositifInDraftsMock.mockResolvedValue(new DispositifModel(newDispositif));

    const updatedDispositif = new DispositifModel(dispositif);
    updatedDispositif.status = DispositifStatus.DRAFT;
    updateDispositifInDBMock.mockResolvedValue(new DispositifModel(updatedDispositif));
    notifyChangeMock.mockResolvedValue();
    logContactMock.mockResolvedValue();
    checkUserIsAuthorizedToModifyDispositifMock.mockReturnValue(true);
    logMock.mockResolvedValue();

    const result = await updateDispositif("5ce7b52d83983700167bca27", { titreInformatif: "nouveau titre" }, user);

    expect(getDispositifByIdMock).toHaveBeenCalled();
    expect(cloneDispositifInDraftsMock).not.toHaveBeenCalled();
    const newDispositifContent = {
      lastModificationAuthor: new ObjectId("6569af9815c38bd134125ff3"),
      lastModificationDate: new Date(2023, 0, 1),
      nbMots: 255,
      themesSelectedByAuthor: true,
      translations: dispositif.translations
    }
    newDispositifContent.translations.fr.content.titreInformatif = "nouveau titre";
    newDispositifContent.translations.fr.created_at = new Date(2023, 0, 1)
    expect(updateDispositifInDBMock).toHaveBeenCalledWith("5ce7b52d83983700167bca27", newDispositifContent, false);
    expect(logContactMock).not.toHaveBeenCalled();
    expect(addNewParticipantMock).toHaveBeenCalledWith(new ObjectId("5ce7b52d83983700167bca27"), new ObjectId("6569af9815c38bd134125ff3"));
    expect(logMock).toHaveBeenCalled();
    expect(notifyChangeMock).not.toHaveBeenCalled();

    expect(result).toEqual({
      text: "success",
      data: {
        id: new ObjectId("5ce7b52d83983700167bca27"),
        mainSponsor: new ObjectId("6569c41c61b13ef31806fadb"),
        typeContenu: "dispositif",
        status: "Brouillon",
        hasDraftVersion: false
      }
    })
  });

  it("updates dispositif, with need of draft version", async () => {
    const getDispositifByIdMock = jest.spyOn(repository, 'getDispositifById');
    const getDraftDispositifByIdMock = jest.spyOn(repository, 'getDraftDispositifById');
    const updateDispositifInDBMock = jest.spyOn(repository, 'updateDispositifInDB');
    const addNewParticipantMock = jest.spyOn(repository, 'addNewParticipant');
    const cloneDispositifInDraftsMock = jest.spyOn(repository, 'cloneDispositifInDrafts');
    const notifyChangeMock = jest.spyOn(service, 'notifyChange');
    const logContactMock = jest.spyOn(logDispositif, 'logContact');
    const checkUserIsAuthorizedToModifyDispositifMock = jest.spyOn(authorizations, 'checkUserIsAuthorizedToModifyDispositif');
    const logMock = jest.spyOn(log, 'log');

    const newDispositif = new DispositifModel(dispositif);
    newDispositif.mainSponsor = new StructureModel(structure);

    getDispositifByIdMock.mockResolvedValue(new DispositifModel(newDispositif));
    getDraftDispositifByIdMock.mockResolvedValue(null);
    addNewParticipantMock.mockResolvedValue(new DispositifModel(newDispositif));

    newDispositif.mainSponsor = new ObjectId("6569c41c61b13ef31806fadb");
    cloneDispositifInDraftsMock.mockResolvedValue(new DispositifModel(newDispositif));

    const updatedDispositif = new DispositifModel(dispositif);
    updatedDispositif.hasDraftVersion = true;
    updateDispositifInDBMock.mockResolvedValue(new DispositifModel(updatedDispositif));
    notifyChangeMock.mockResolvedValue();
    logContactMock.mockResolvedValue();
    checkUserIsAuthorizedToModifyDispositifMock.mockReturnValue(true);
    logMock.mockResolvedValue();

    const result = await updateDispositif("5ce7b52d83983700167bca27", { titreInformatif: "nouveau titre" }, user);

    expect(getDispositifByIdMock).toHaveBeenCalled();
    const newDispositifContent = {
      lastModificationAuthor: new ObjectId("6569af9815c38bd134125ff3"),
      lastModificationDate: new Date(2023, 0, 1),
      nbMots: 255,
      themesSelectedByAuthor: true,
      translations: dispositif.translations
    }
    newDispositifContent.translations.fr.content.titreInformatif = "nouveau titre";
    newDispositifContent.translations.fr.created_at = new Date(2023, 0, 1)
    expect(cloneDispositifInDraftsMock).toHaveBeenCalledWith("5ce7b52d83983700167bca27", {
      ...newDispositifContent,
      status: DispositifStatus.DRAFT
    });
    expect(updateDispositifInDBMock).toHaveBeenCalledWith("5ce7b52d83983700167bca27", { hasDraftVersion: true }, false);
    expect(logContactMock).not.toHaveBeenCalled();
    expect(addNewParticipantMock).toHaveBeenCalledWith(new ObjectId("5ce7b52d83983700167bca27"), new ObjectId("6569af9815c38bd134125ff3"));
    expect(logMock).toHaveBeenCalled();
    expect(notifyChangeMock).toHaveBeenCalledWith(service.NotifType.UPDATED, "5ce7b52d83983700167bca27", new ObjectId("6569af9815c38bd134125ff3"));

    expect(result).toEqual({
      text: "success",
      data: {
        id: new ObjectId("5ce7b52d83983700167bca27"),
        mainSponsor: new ObjectId("6569c41c61b13ef31806fadb"),
        typeContenu: "dispositif",
        status: "Actif",
        hasDraftVersion: true
      }
    })
  });


  it("updates dispositif, and reverts to draft", async () => {
    const getDispositifByIdMock = jest.spyOn(repository, 'getDispositifById');
    const getDraftDispositifByIdMock = jest.spyOn(repository, 'getDraftDispositifById');
    const updateDispositifInDBMock = jest.spyOn(repository, 'updateDispositifInDB');
    const addNewParticipantMock = jest.spyOn(repository, 'addNewParticipant');
    const cloneDispositifInDraftsMock = jest.spyOn(repository, 'cloneDispositifInDrafts');
    const notifyChangeMock = jest.spyOn(service, 'notifyChange');
    const logContactMock = jest.spyOn(logDispositif, 'logContact');
    const checkUserIsAuthorizedToModifyDispositifMock = jest.spyOn(authorizations, 'checkUserIsAuthorizedToModifyDispositif');
    const logMock = jest.spyOn(log, 'log');

    const newDispositif = new DispositifModel(dispositif);
    newDispositif.status = DispositifStatus.WAITING_ADMIN;
    newDispositif.mainSponsor = null;

    getDispositifByIdMock.mockResolvedValue(new DispositifModel(newDispositif));
    getDraftDispositifByIdMock.mockResolvedValue(null);
    addNewParticipantMock.mockResolvedValue(new DispositifModel(newDispositif));
    cloneDispositifInDraftsMock.mockResolvedValue(new DispositifModel(newDispositif));
    updateDispositifInDBMock.mockResolvedValueOnce(new DispositifModel(newDispositif));
    notifyChangeMock.mockResolvedValue();
    logContactMock.mockResolvedValue();
    checkUserIsAuthorizedToModifyDispositifMock.mockReturnValue(true);
    logMock.mockResolvedValue();

    const result = await updateDispositif("5ce7b52d83983700167bca27", { titreInformatif: "nouveau titre" }, user);

    expect(getDispositifByIdMock).toHaveBeenCalled();
    expect(cloneDispositifInDraftsMock).not.toHaveBeenCalled();
    const newDispositifContent = {
      lastModificationAuthor: new ObjectId("6569af9815c38bd134125ff3"),
      lastModificationDate: new Date(2023, 0, 1),
      nbMots: 255,
      themesSelectedByAuthor: true,
      translations: dispositif.translations
    }
    newDispositifContent.translations.fr.content.titreInformatif = "nouveau titre";
    newDispositifContent.translations.fr.created_at = new Date(2023, 0, 1)
    expect(updateDispositifInDBMock).toHaveBeenCalledWith("5ce7b52d83983700167bca27", newDispositifContent, false);
    expect(updateDispositifInDBMock).toHaveBeenCalledWith("5ce7b52d83983700167bca27", { status: DispositifStatus.DRAFT });
    expect(logContactMock).not.toHaveBeenCalled();
    expect(addNewParticipantMock).toHaveBeenCalledWith(new ObjectId("5ce7b52d83983700167bca27"), new ObjectId("6569af9815c38bd134125ff3"));
    expect(logMock).toHaveBeenCalled();
    expect(notifyChangeMock).toHaveBeenCalledWith(service.NotifType.UPDATED, "5ce7b52d83983700167bca27", new ObjectId("6569af9815c38bd134125ff3"));

    expect(result).toEqual({
      text: "success",
      data: {
        id: new ObjectId("5ce7b52d83983700167bca27"),
        mainSponsor: null,
        typeContenu: "dispositif",
        status: "Brouillon",
        hasDraftVersion: false
      }
    })
  });

  it("updates dispositif, log contact and no notify change", async () => {
    const getDispositifByIdMock = jest.spyOn(repository, 'getDispositifById');
    const getDraftDispositifByIdMock = jest.spyOn(repository, 'getDraftDispositifById');
    const updateDispositifInDBMock = jest.spyOn(repository, 'updateDispositifInDB');
    const addNewParticipantMock = jest.spyOn(repository, 'addNewParticipant');
    const cloneDispositifInDraftsMock = jest.spyOn(repository, 'cloneDispositifInDrafts');
    const notifyChangeMock = jest.spyOn(service, 'notifyChange');
    const logContactMock = jest.spyOn(logDispositif, 'logContact');
    const checkUserIsAuthorizedToModifyDispositifMock = jest.spyOn(authorizations, 'checkUserIsAuthorizedToModifyDispositif');
    const logMock = jest.spyOn(log, 'log');

    const newDispositif = new DispositifModel(dispositif);
    newDispositif.status = DispositifStatus.DRAFT;
    newDispositif.mainSponsor = new StructureModel(structure);
    newDispositif.lastModificationDate = new Date(2023, 0, 1);

    getDispositifByIdMock.mockResolvedValue(new DispositifModel(newDispositif));
    getDraftDispositifByIdMock.mockResolvedValue(null);
    addNewParticipantMock.mockResolvedValue(new DispositifModel(newDispositif));
    cloneDispositifInDraftsMock.mockResolvedValue(new DispositifModel(newDispositif));

    const updatedDispositif = new DispositifModel(dispositif);
    updatedDispositif.status = DispositifStatus.DRAFT;
    updateDispositifInDBMock.mockResolvedValue(new DispositifModel(updatedDispositif));
    notifyChangeMock.mockResolvedValue();
    logContactMock.mockResolvedValue();
    checkUserIsAuthorizedToModifyDispositifMock.mockReturnValue(true);
    logMock.mockResolvedValue();

    const result = await updateDispositif("5ce7b52d83983700167bca27", {
      titreInformatif: "nouveau titre",
      contact: {
        name: "new sponsor",
        isMember: true,
        isMe: true
      }
    }, user);

    expect(getDispositifByIdMock).toHaveBeenCalled();
    expect(cloneDispositifInDraftsMock).not.toHaveBeenCalled();
    const newDispositifContent = {
      lastModificationAuthor: new ObjectId("6569af9815c38bd134125ff3"),
      lastModificationDate: new Date(2023, 0, 1),
      nbMots: 255,
      themesSelectedByAuthor: true,
      translations: dispositif.translations
    }
    newDispositifContent.translations.fr.content.titreInformatif = "nouveau titre";
    newDispositifContent.translations.fr.created_at = new Date(2023, 0, 1)
    expect(updateDispositifInDBMock).toHaveBeenCalledWith("5ce7b52d83983700167bca27", newDispositifContent, false);
    expect(logContactMock).toHaveBeenCalledWith(new ObjectId("6569af9815c38bd134125ff3"), new ObjectId("6569c41c61b13ef31806fadb"), {
      name: "new sponsor",
      isMember: true,
      isMe: true
    });
    expect(addNewParticipantMock).toHaveBeenCalledWith(new ObjectId("5ce7b52d83983700167bca27"), new ObjectId("6569af9815c38bd134125ff3"));
    expect(logMock).toHaveBeenCalled();
    expect(notifyChangeMock).not.toHaveBeenCalled();

    expect(result).toEqual({
      text: "success",
      data: {
        id: new ObjectId("5ce7b52d83983700167bca27"),
        mainSponsor: new ObjectId("6569c41c61b13ef31806fadb"),
        typeContenu: "dispositif",
        status: "Brouillon",
        hasDraftVersion: false
      }
    })
  });

  it("updates draft dispositif", async () => {
    const getDispositifByIdMock = jest.spyOn(repository, 'getDispositifById');
    const getDraftDispositifByIdMock = jest.spyOn(repository, 'getDraftDispositifById');
    const updateDispositifInDBMock = jest.spyOn(repository, 'updateDispositifInDB');
    const addNewParticipantMock = jest.spyOn(repository, 'addNewParticipant');
    const cloneDispositifInDraftsMock = jest.spyOn(repository, 'cloneDispositifInDrafts');
    const notifyChangeMock = jest.spyOn(service, 'notifyChange');
    const logContactMock = jest.spyOn(logDispositif, 'logContact');
    const checkUserIsAuthorizedToModifyDispositifMock = jest.spyOn(authorizations, 'checkUserIsAuthorizedToModifyDispositif');
    const logMock = jest.spyOn(log, 'log');

    const newDispositif = new DispositifModel(dispositif);
    newDispositif.status = DispositifStatus.ACTIVE;
    newDispositif.mainSponsor = new StructureModel(structure);

    const draftDispositif = new DispositifModel(dispositif);
    draftDispositif.status = DispositifStatus.DRAFT;
    draftDispositif.mainSponsor = new StructureModel(structure);

    getDispositifByIdMock.mockResolvedValue(new DispositifModel(newDispositif));
    getDraftDispositifByIdMock.mockResolvedValue(new DispositifModel(draftDispositif));
    addNewParticipantMock.mockResolvedValue(new DispositifModel(newDispositif));
    cloneDispositifInDraftsMock.mockResolvedValue(new DispositifModel(newDispositif));

    const updatedDispositif = new DispositifModel(dispositif);
    updatedDispositif.status = DispositifStatus.DRAFT;
    updateDispositifInDBMock.mockResolvedValue(new DispositifModel(updatedDispositif));
    notifyChangeMock.mockResolvedValue();
    logContactMock.mockResolvedValue();
    checkUserIsAuthorizedToModifyDispositifMock.mockReturnValue(true);
    logMock.mockResolvedValue();

    const result = await updateDispositif("5ce7b52d83983700167bca27", { titreInformatif: "nouveau titre" }, user);

    expect(getDispositifByIdMock).not.toHaveBeenCalled();
    expect(cloneDispositifInDraftsMock).not.toHaveBeenCalled();
    const newDispositifContent = {
      lastModificationAuthor: new ObjectId("6569af9815c38bd134125ff3"),
      lastModificationDate: new Date(2023, 0, 1),
      nbMots: 255,
      themesSelectedByAuthor: true,
      translations: dispositif.translations
    }
    newDispositifContent.translations.fr.content.titreInformatif = "nouveau titre";
    newDispositifContent.translations.fr.created_at = new Date(2023, 0, 1)
    expect(updateDispositifInDBMock).toHaveBeenCalledWith("5ce7b52d83983700167bca27", newDispositifContent, true);
    expect(logContactMock).not.toHaveBeenCalled();
    expect(addNewParticipantMock).toHaveBeenCalledWith(new ObjectId("5ce7b52d83983700167bca27"), new ObjectId("6569af9815c38bd134125ff3"));
    expect(logMock).toHaveBeenCalled();
    expect(notifyChangeMock).toHaveBeenCalledWith(service.NotifType.UPDATED, "5ce7b52d83983700167bca27", new ObjectId("6569af9815c38bd134125ff3"));

    expect(result).toEqual({
      text: "success",
      data: {
        id: new ObjectId("5ce7b52d83983700167bca27"),
        mainSponsor: new ObjectId("6569c41c61b13ef31806fadb"),
        typeContenu: "dispositif",
        status: "Brouillon",
        hasDraftVersion: true
      }
    })
  });

  it("updates dispositif, allow empty titles", async () => {
    const getDispositifByIdMock = jest.spyOn(repository, 'getDispositifById');
    const getDraftDispositifByIdMock = jest.spyOn(repository, 'getDraftDispositifById');
    const updateDispositifInDBMock = jest.spyOn(repository, 'updateDispositifInDB');
    const addNewParticipantMock = jest.spyOn(repository, 'addNewParticipant');
    const cloneDispositifInDraftsMock = jest.spyOn(repository, 'cloneDispositifInDrafts');
    const notifyChangeMock = jest.spyOn(service, 'notifyChange');
    const logContactMock = jest.spyOn(logDispositif, 'logContact');
    const checkUserIsAuthorizedToModifyDispositifMock = jest.spyOn(authorizations, 'checkUserIsAuthorizedToModifyDispositif');
    const logMock = jest.spyOn(log, 'log');

    const newDispositif = new DispositifModel(dispositif);
    newDispositif.status = DispositifStatus.DRAFT;
    newDispositif.mainSponsor = new StructureModel(structure);

    getDispositifByIdMock.mockResolvedValue(new DispositifModel(newDispositif));
    getDraftDispositifByIdMock.mockResolvedValue(null);
    addNewParticipantMock.mockResolvedValue(new DispositifModel(newDispositif));
    cloneDispositifInDraftsMock.mockResolvedValue(new DispositifModel(newDispositif));

    const updatedDispositif = new DispositifModel(dispositif);
    updatedDispositif.status = DispositifStatus.DRAFT;
    updateDispositifInDBMock.mockResolvedValue(new DispositifModel(updatedDispositif));
    notifyChangeMock.mockResolvedValue();
    logContactMock.mockResolvedValue();
    checkUserIsAuthorizedToModifyDispositifMock.mockReturnValue(true);
    logMock.mockResolvedValue();

    const result = await updateDispositif("5ce7b52d83983700167bca27", { titreInformatif: "" }, user);

    expect(getDispositifByIdMock).toHaveBeenCalled();
    expect(cloneDispositifInDraftsMock).not.toHaveBeenCalled();
    const newDispositifContent = {
      lastModificationAuthor: new ObjectId("6569af9815c38bd134125ff3"),
      lastModificationDate: new Date(2023, 0, 1),
      nbMots: 253,
      themesSelectedByAuthor: true,
      translations: dispositif.translations
    }
    newDispositifContent.translations.fr.content.titreInformatif = "";
    newDispositifContent.translations.fr.created_at = new Date(2023, 0, 1)
    expect(updateDispositifInDBMock).toHaveBeenCalledWith("5ce7b52d83983700167bca27", newDispositifContent, false);
    expect(logContactMock).not.toHaveBeenCalled();
    expect(addNewParticipantMock).toHaveBeenCalledWith(new ObjectId("5ce7b52d83983700167bca27"), new ObjectId("6569af9815c38bd134125ff3"));
    expect(logMock).toHaveBeenCalled();
    expect(notifyChangeMock).not.toHaveBeenCalled();

    expect(result).toEqual({
      text: "success",
      data: {
        id: new ObjectId("5ce7b52d83983700167bca27"),
        mainSponsor: new ObjectId("6569c41c61b13ef31806fadb"),
        typeContenu: "dispositif",
        status: "Brouillon",
        hasDraftVersion: false
      }
    })
  });
});
