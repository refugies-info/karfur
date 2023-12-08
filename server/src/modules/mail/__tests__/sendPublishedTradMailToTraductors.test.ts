// @ts-nocheck
import { sendPublishedTradMailToTraductors } from "../sendPublishedTradMailToTraductors";
import { getUserById } from "../../users/users.repository";
import { sendPublishedTradMailToTraductorsService } from "../mail.service";

jest.mock("../../users/users.repository", () => ({
  getUserById: jest.fn(),
}));

jest.mock("../mail.service", () => ({
  sendPublishedTradMailToTraductorsService: jest.fn(),
}));

describe.skip("sendPublishedTradMailToTraductors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should getUser and send mail when dispositif", async () => {
    getUserById.mockResolvedValueOnce({ status: "Exclu" });
    getUserById.mockResolvedValueOnce({ status: "Actif" });
    getUserById.mockResolvedValue({
      status: "Actif",
      email: "email",
      username: "pseudo",
    });

    const userNeededFields = {
      username: 1,
      email: 1,
      status: 1,
    };
    await sendPublishedTradMailToTraductors(
      ["id1", "id2", "id3", "id4"],
      "en",
      "dispositif",
      "titreInfo",
      "titreMarque",
      "dispositifId"
    );

    const data = {
      dispositifId: "dispositifId",
      userId: "userId",
      titreInformatif: "titreInfo",
      titreMarque: "titreMarque",
      lien: "https://refugies.info/dispositif/dispositifId",
      langue: "anglais",
      isDispositif: true,
    };
    expect(getUserById).toHaveBeenCalledWith("id1", userNeededFields);
    expect(getUserById).toHaveBeenCalledWith("id2", userNeededFields);
    expect(getUserById).toHaveBeenCalledWith("id3", userNeededFields);
    expect(getUserById).toHaveBeenCalledWith("id4", userNeededFields);

    expect(sendPublishedTradMailToTraductorsService).toHaveBeenCalledWith({
      ...data,
      email: "email",
      pseudo: "pseudo",
      userId: "id3",
    });
    expect(sendPublishedTradMailToTraductorsService).toHaveBeenCalledWith({
      ...data,
      email: "email",
      pseudo: "pseudo",
      userId: "id4",
    });
    expect(sendPublishedTradMailToTraductorsService).toHaveBeenCalledTimes(2);
  });

  it("should getUser and send mailwhen demarche", async () => {
    getUserById.mockResolvedValue({
      status: "Actif",
      email: "email",
      username: "pseudo",
    });

    const userNeededFields = {
      username: 1,
      email: 1,
      status: 1,
    };
    await sendPublishedTradMailToTraductors(
      ["id1"],
      "ps",
      "demarche",
      "titreInfo",
      "titreMarque",
      "demarcheId"
    );

    const data = {
      dispositifId: "demarcheId",
      userId: "userId",
      titreInformatif: "titreInfo",
      titreMarque: "titreMarque",
      lien: "https://refugies.info/demarche/demarcheId",
      langue: "pachto",
      isDispositif: false,
    };
    expect(getUserById).toHaveBeenCalledWith("id1", userNeededFields);

    expect(sendPublishedTradMailToTraductorsService).toHaveBeenCalledWith({
      ...data,
      email: "email",
      pseudo: "pseudo",
      userId: "id1",
    });

    expect(sendPublishedTradMailToTraductorsService).toHaveBeenCalledTimes(1);
  });
});
