// @ts-nocheck
import {
  sendWelcomeMail,
  sendResetPasswordMail,
  sendOneDraftReminderMailService,
  sendMultipleDraftsReminderMailService,
  sendPublishedFicheMailToStructureMembersService,
  sendPublishedTradMailToStructureService,
  sendPublishedFicheMailToCreatorService,
  sendNewFicheEnAttenteMail,
  sendPublishedTradMailToTraductorsService,
  sendAdminImprovementsMailService,
  sendSubscriptionReminderMailService,
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

describe("sendResetPasswordMail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call send mail and add mail event", async () => {
    await sendResetPasswordMail("pseudo", "lien_reinitialisation", "email");
    const templateName = "resetPassword";
    const dynamicData = {
      to: "email",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      // cc: "contact@refugies.info",
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        Pseudonyme: "pseudo",
        lien_reinitialisation: "lien_reinitialisation",
      },
    };
    expect(sendMail).toHaveBeenCalledWith(templateName, dynamicData);
    expect(addMailEvent).toHaveBeenCalledWith({
      templateName,
      username: "pseudo",
      email: "email",
    });
  });
});

describe("sendSubscriptionReminderMailService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call send mail and add mail event", async () => {
    await sendSubscriptionReminderMailService("email");
    const templateName = "subscriptionReminderMail";
    const dynamicData = {
      to: "email",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      // cc: "contact@refugies.info",
      reply_to: "contact@email.refugies.info",
    };

    expect(sendMail).toHaveBeenCalledWith(templateName, dynamicData);
    expect(addMailEvent).toHaveBeenCalledWith({
      templateName,
      email: "email",
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
      "dispositifId",
      "first"
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
    await sendMultipleDraftsReminderMailService("email", "username", "userId", "first");
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
      langue: "anglais",
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

describe("sendPublishedTradMailToTraductorsService", () => {
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
      langue: "pachto",
      isDispositif: false,
    };
    await sendPublishedTradMailToTraductorsService(data);
    const templateName = "publishedTradForTraductors";
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
        isDispositif: false,
        pseudo: "pseudo",
        langue: "pachto",
      },
    };

    expect(sendMail).toHaveBeenCalledWith(templateName, dynamicData);
    expect(addMailEvent).toHaveBeenCalledWith({
      templateName,
      username: "pseudo",
      email: "email",
      userId: "userId",
      dispositifId: "dispositifId",
      langue: "pachto",
    });
  });
});

describe("sendAdminImprovementsMailService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call send mail and add mail event", async () => {
    const sectionsToModify = {
      quoi: true,
      qui: true,
      interessant: false,
      engagement: false,
      carte: true,
    };
    const data = {
      pseudo: "pseudo",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "lien",
      email: "email",
      dispositifId: "dispositifId",
      userId: "userId",
      sectionsToModify,
    };
    await sendAdminImprovementsMailService(data);
    const templateName = "reviewFiche";
    const dynamicData = {
      to: "email",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      cc: "alice@refugies.info",
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        titreInformatif: "TI",
        titreMarque: "TM",
        lien: "lien",
        sectionsToModify,
        pseudo: "pseudo",
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
