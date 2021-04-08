// @ts-nocheck
import {
  sendWelcomeMail,
  sendOneDraftReminderMailService,
  sendMultipleDraftsReminderMailService,
  sendPublishedFicheMail,
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

describe("sendPublishedFicheMail", () => {
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
    await sendPublishedFicheMail(data);
    const templateName = "publishedFiche";
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
