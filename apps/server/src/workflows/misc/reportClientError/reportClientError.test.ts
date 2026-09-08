import { slackClientError } from "~/connectors/slack/sendSlackNotif";
import { getDispositifById } from "~/modules/dispositif/dispositif.repository";
import reportClientError from "./reportClientError";

jest.mock("~/connectors/slack/sendSlackNotif", () => ({
  slackClientError: jest.fn(() => Promise.resolve()),
}));

jest.mock("~/modules/dispositif/dispositif.repository", () => ({
  getDispositifById: jest.fn(),
}));

const user = { _id: "user-1", username: "Rédactrice", email: "redac@example.org" } as any;

const request = (overrides: Record<string, unknown> = {}) => ({
  reference: "ace61be184d84d21a6fa1055e1f0eb06",
  source: "autosave-translate",
  status: 422,
  message: "Validation Failed",
  fields: [{ path: "body.translated.content", reason: "invalid object" }],
  dispositifId: "dispo-1",
  ...overrides,
});

describe("reportClientError", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (getDispositifById as jest.Mock).mockResolvedValue({
      typeContenu: "demarche",
      translations: { fr: { content: { titreInformatif: "Demander l'AME" } } },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("notifie avec le type et le titre résolus en base, pas ceux du navigateur", async () => {
    await reportClientError(request() as any, user);

    expect(slackClientError).toHaveBeenCalledWith(
      expect.objectContaining({
        reference: "ace61be184d84d21a6fa1055e1f0eb06",
        typeContenu: "demarche",
        dispositifTitle: "Demander l'AME",
        username: "Rédactrice",
        email: "redac@example.org",
      }),
    );
  });

  it("transmet le volume envoyé et le plafond", async () => {
    await reportClientError(
      request({
        dispositifId: "dispo-size",
        payloadSize: { bytes: 3_145_728, limitBytes: 52_428_800 },
      }) as any,
      user,
    );

    expect(slackClientError).toHaveBeenCalledWith(
      expect.objectContaining({ payloadSize: { bytes: 3_145_728, limitBytes: 52_428_800 } }),
    );
  });

  it("notifie sans lien quand la fiche est introuvable", async () => {
    (getDispositifById as jest.Mock).mockRejectedValue(new Error("Cast to ObjectId failed"));

    await reportClientError(request({ dispositifId: "pas-un-id" }) as any, user);

    expect(slackClientError).toHaveBeenCalledWith(
      expect.objectContaining({ typeContenu: null, dispositifTitle: null }),
    );
  });

  // La fenêtre d'anti-spam est portée par un état de module : chaque test utilise sa propre
  // fiche pour ne pas consommer le quota d'un autre.
  it("ne notifie qu'une fois quand le même échec se répète", async () => {
    await reportClientError(request({ dispositifId: "dispo-repeat" }) as any, user);
    await reportClientError(
      request({ dispositifId: "dispo-repeat", reference: "autre-reference" }) as any,
      user,
    );

    expect(slackClientError).toHaveBeenCalledTimes(1);
  });

  it("notifie immédiatement un échec d'une autre nature", async () => {
    await reportClientError(request({ dispositifId: "dispo-2" }) as any, user);
    await reportClientError(request({ dispositifId: "dispo-2", status: 500 }) as any, user);

    expect(slackClientError).toHaveBeenCalledTimes(2);
  });

  it("réautorise la notification une fois la fenêtre écoulée", async () => {
    await reportClientError(request({ dispositifId: "dispo-3" }) as any, user);
    jest.advanceTimersByTime(6 * 60_000);
    await reportClientError(request({ dispositifId: "dispo-3" }) as any, user);

    expect(slackClientError).toHaveBeenCalledTimes(2);
  });
});
