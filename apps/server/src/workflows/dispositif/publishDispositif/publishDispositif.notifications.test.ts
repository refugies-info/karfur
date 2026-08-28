import { DispositifStatus, type PublishDispositifRequest } from "@refugies-info/api-types";
import {
  DispositifDraftModel,
  DispositifModel,
  SnapshotModel,
  StructureModel,
  TraductionsModel,
  UserModel,
} from "@refugies-info/mongo";
import { sendSlackNotif } from "~/connectors/slack/sendSlackNotif";
import { fixtures } from "../../../__fixtures__";
import { publishDispositif } from "../publishDispositif";

jest.mock("~/connectors/slack/sendSlackNotif", () => ({
  sendSlackNotif: jest.fn(),
  slackDeletedAccount: jest.fn(),
}));

const mockedSendSlackNotif = sendSlackNotif as jest.Mock;

const body: PublishDispositifRequest = { keepTranslations: false };

/** Create an ACTIVE dispositif with a draft version, and return its id */
const setupActiveDispositifWithDraft = async (editDraft: (draft: any) => void): Promise<string> => {
  const dispositif = await DispositifModel.create({
    ...fixtures.dispositif,
    status: DispositifStatus.ACTIVE,
    hasDraftVersion: true,
    creatorId: fixtures.user._id,
  });
  const draft: any = await DispositifModel.findById(dispositif._id).lean();
  editDraft(draft);
  await DispositifDraftModel.create(draft);
  return dispositif._id.toString();
};

describe("publishDispositif - slack notifications", () => {
  beforeEach(async () => {
    await DispositifModel.deleteMany({});
    await DispositifDraftModel.deleteMany({});
    await SnapshotModel.deleteMany({});
    await StructureModel.deleteMany({});
    await UserModel.deleteMany({});
    await TraductionsModel.deleteMany({});
    mockedSendSlackNotif.mockClear();

    await UserModel.create({
      ...fixtures.user.toObject(),
      structures: [fixtures.structure._id],
    });
    await StructureModel.create(fixtures.structure.toObject());
  });

  it("notifies that metadatas were published when a structure member publishes without text changes", async () => {
    const id = await setupActiveDispositifWithDraft((draft) => {
      draft.metadatas = {
        ...draft.metadatas,
        price: { values: [42] },
        timeSlots: ["tuesday"],
      };
    });

    await publishDispositif(id, body, fixtures.user);

    expect(mockedSendSlackNotif).toHaveBeenCalledTimes(1);
    const [title, text] = mockedSendSlackNotif.mock.calls[0];
    expect(title).toBe(":paperclip: Métadonnées modifiées et publiées");
    expect(text).toBe(
      "Les métadonnées de la fiche dispositif *Des mots d'ancrage - Apprendre le français* ont été modifiées puis publiées par _user_ de la structure _Mot à Mot_. Champs modifiés : Prix, Créneaux horaires.",
    );
  });

  it("keeps the 'validated and published' notification when an admin publishes", async () => {
    const isAdminSpy = jest.spyOn(fixtures.user, "isAdmin").mockReturnValue(true);
    try {
      const id = await setupActiveDispositifWithDraft((draft) => {
        draft.translations.fr.content.abstract = `Mise à jour du ${draft.translations.fr.content.abstract}`;
      });

      await publishDispositif(id, body, fixtures.user);

      expect(mockedSendSlackNotif).toHaveBeenCalledTimes(1);
      const [title, text] = mockedSendSlackNotif.mock.calls[0];
      expect(title).toBe(":white_check_mark: Fiche validée et publiée");
      expect(text).toContain("ont été validées et publiées");
    } finally {
      isAdminSpy.mockRestore();
    }
  });

  it("keeps the 'to validate' notification when a structure member changes texts", async () => {
    const id = await setupActiveDispositifWithDraft((draft) => {
      draft.translations.fr.content.abstract = `Mise à jour du ${draft.translations.fr.content.abstract}`;
    });

    await publishDispositif(id, body, fixtures.user);

    expect(mockedSendSlackNotif).toHaveBeenCalledTimes(1);
    const [title] = mockedSendSlackNotif.mock.calls[0];
    expect(title).toBe("Fiche mise à jour à valider :eyes::exclamation:");
  });
});
