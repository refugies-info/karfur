// @ts-nocheck
import {
  sendWelcomeMail,
  sendOneDraftReminderMailService,
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
