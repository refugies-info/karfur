// @ts-nocheck
import {
  sendWelcomeMail,
  sendOneDraftReminderMailService,
  sendMultipleDraftsReminderMailService,
  sendPublishedFicheMailToStructureMembersService,
  sendPublishedTradMailToStructureService,
  sendPublishedFicheMailToCreatorService,
  sendNewFicheEnAttenteMail,
} from "../mail.service";
import { sendMail } from "../../../connectors/sendgrid/sendMail";
import { addMailEvent } from "../mail.repository";

jest.mock("../../../connectors/sendgrid/sendMail", () => ({
  sendMail: jest.fn(),
}));

jest.mock("../mail.repository", () => ({
  addMailEvent: jest.fn(),
}));

describe("sendWelcomeMail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call send mail and add mail event", async () => {
    await sendWelcomeMail("email", "username", "userId");
    const templateName = "newUserWelcome";
    const dynamicData = {
      to: "email",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      // cc: "contact@refugies.info",
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        pseudo: "username",
      },
    };

    expect(sendMail).toHaveBeenCalledWith(templateName, dynamicData);
    expect(addMailEvent).toHaveBeenCalledWith({
      templateName,
      username: "username",
      email: "email",
      userId: "userId",
    });
  });
});

describe("sendOneDraftReminderMailService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call send mail and add mail event", async () => {
    await sendOneDraftReminderMailService(
      "email",
      "username",
      "titre",
      "userId",
      "dispositifId"
    );
    const templateName = "oneDraftReminder";
    const dynamicData = {
      to: "email",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      // cc: "contact@refugies.info",
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        pseudo: "username",
        titreInformatif: "titre",
      },
    };

    expect(sendMail).toHaveBeenCalledWith(templateName, dynamicData);
    expect(addMailEvent).toHaveBeenCalledWith({
      templateName,
      username: "username",
      email: "email",
      userId: "userId",
      dispositifId: "dispositifId",
    });
  });
});

describe("sendMultipleDraftsReminderMailService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call send mail and add mail event", async () => {
    await sendMultipleDraftsReminderMailService("email", "username", "userId");
    const templateName = "multipleDraftsReminder";
    const dynamicData = {
      to: "email",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      // cc: "contact@refugies.info",
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        pseudo: "username",
      },
    };

    expect(sendMail).toHaveBeenCalledWith(templateName, dynamicData);
    expect(addMailEvent).toHaveBeenCalledWith({
      templateName,
      username: "username",
      email: "email",
      userId: "userId",
    });
  });
});

describe("sendPublishedFicheMailToStructureMembersService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call send mail and add mail event", async () => {
    const data = {
      pseudo: "pseudo",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "lien",
      email: "email",
      dispositifId: "dispositifId",
      userId: "userId",
    };
    await sendPublishedFicheMailToStructureMembersService(data);
    const templateName = "publishedFicheToStructureMembers";
    const dynamicData = {
      to: "email",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      // cc: "contact@refugies.info",
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        pseudo: "pseudo",
        titreInformatif: "TI",
        titreMarque: "TM",
        lien: "lien",
      },
    };

    expect(sendMail).toHaveBeenCalledWith(templateName, dynamicData);
    expect(addMailEvent).toHaveBeenCalledWith({
      templateName,
      username: "pseudo",
      email: "email",
      userId: "userId",
      dispositifId: "dispositifId",
    });
  });
});

describe("sendPublishedFicheMailToCreatorService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call send mail and add mail event", async () => {
    const data = {
      pseudo: "pseudo",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "lien",
      email: "email",
      dispositifId: "dispositifId",
      userId: "userId",
    };
    await sendPublishedFicheMailToCreatorService(data);
    const templateName = "publishedFicheToCreator";
    const dynamicData = {
      to: "email",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      // cc: "contact@refugies.info",
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        pseudo: "pseudo",
        titreInformatif: "TI",
        titreMarque: "TM",
        lien: "lien",
      },
    };

    expect(sendMail).toHaveBeenCalledWith(templateName, dynamicData);
    expect(addMailEvent).toHaveBeenCalledWith({
      templateName,
      username: "pseudo",
      email: "email",
      userId: "userId",
      dispositifId: "dispositifId",
    });
  });
});

describe("sendPublishedTradMailToStructureService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call send mail and add mail event", async () => {
    const data = {
      pseudo: "pseudo",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "lien",
      email: "email",
      dispositifId: "dispositifId",
      userId: "userId",
      langue: "anglais",
    };
    await sendPublishedTradMailToStructureService(data);
    const templateName = "publishedTradForStructure";
    const dynamicData = {
      to: "email",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      // cc: "contact@refugies.info",
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        titreInformatif: "TI",
        titreMarque: "TM",
        lien: "lien",
        langue: "anglais",
      },
    };

    expect(sendMail).toHaveBeenCalledWith(templateName, dynamicData);
    expect(addMailEvent).toHaveBeenCalledWith({
      templateName,
      username: "pseudo",
      email: "email",
      userId: "userId",
      dispositifId: "dispositifId",
    });
  });
});

describe("sendNewFicheEnAttenteMail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call send mail and add mail event", async () => {
    const data = {
      pseudo: "pseudo",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "lien",
      email: "email",
      dispositifId: "dispositifId",
      userId: "userId",
    };
    await sendNewFicheEnAttenteMail(data);
    const templateName = "newFicheEnAttente";
    const dynamicData = {
      to: "email",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      // cc: "contact@refugies.info",
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        titreInformatif: "TI",
        titreMarque: "TM",
        lien: "lien",
      },
    };

    expect(sendMail).toHaveBeenCalledWith(templateName, dynamicData);
    expect(addMailEvent).toHaveBeenCalledWith({
      templateName,
      username: "pseudo",
      email: "email",
      userId: "userId",
      dispositifId: "dispositifId",
    });
  });
});
