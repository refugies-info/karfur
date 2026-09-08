import * as Sentry from "@sentry/nextjs";
import API from "../utils/API";
import { formatBytes, reportAutosaveError } from "./autosaveError";

jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(() => "event-id"),
  withScope: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

jest.mock("../utils/API", () => ({
  __esModule: true,
  default: { reportClientError: jest.fn(() => Promise.resolve(null)) },
}));

const buildScope = () => ({ setTag: jest.fn(), setContext: jest.fn() });

const validationError = (field: string, message = "invalid object") => ({
  response: {
    status: 422,
    data: { message: "Validation Failed", data: { [field]: { message } } },
  },
});

/** Message réel de tsoa pour `translated.content` : le motif utile est noyé dans l'union. */
const UNION_EXCESS_MESSAGE =
  "Could not match the union against any of the items. " +
  'Issues: [{"body.translated.content":{"message":""markdown" is an excess property ' +
  'and therefore is not allowed"}},{"body.translated.content":{"message":"invalid undefined value"}}]';

describe("reportAutosaveError", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Sentry.captureException as jest.Mock).mockImplementation((_error, callback) => {
      callback?.(buildScope());
      return "event-id";
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("extrait le champ refusé par l'API", () => {
    const details = reportAutosaveError(validationError("body.metadatas.sessions"), {
      mode: "edit",
      dispositifId: "abc",
    });

    expect(details.status).toBe(422);
    expect(details.fields).toEqual(["body.metadatas.sessions"]);
    expect(details.message).toBe("Validation Failed");
  });

  it("n'envoie qu'un événement quand le même échec se répète", () => {
    const error = validationError("body.metadatas.sessions");
    const context = { mode: "edit" as const, dispositifId: "throttle-1" };

    reportAutosaveError(error, context);
    reportAutosaveError(error, context);
    reportAutosaveError(error, context);

    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
  });

  it("garde la référence Sentry même lorsque l'envoi est filtré", () => {
    const error = validationError("body.metadatas.sessions");
    const context = { mode: "edit" as const, dispositifId: "throttle-2" };

    const first = reportAutosaveError(error, context);
    const second = reportAutosaveError(error, context);

    expect(first.eventId).toBe("event-id");
    expect(second.eventId).toBe("event-id");
  });

  it("remonte immédiatement un échec d'une autre nature", () => {
    const context = { mode: "edit" as const, dispositifId: "throttle-3" };

    reportAutosaveError(validationError("body.metadatas.age"), context);
    reportAutosaveError({ message: "Network Error" }, context);

    expect(Sentry.captureException).toHaveBeenCalledTimes(2);
  });

  it("ne masque pas le même échec survenu sur une autre fiche", () => {
    const error = validationError("body.metadatas.sessions");

    reportAutosaveError(error, { mode: "edit", dispositifId: "fiche-A" });
    reportAutosaveError(error, { mode: "edit", dispositifId: "fiche-B" });

    expect(Sentry.captureException).toHaveBeenCalledTimes(2);
  });

  it("réautorise l'envoi une fois la fenêtre écoulée", () => {
    const error = validationError("body.metadatas.price");
    const context = { mode: "edit" as const, dispositifId: "throttle-4" };

    reportAutosaveError(error, context);
    jest.advanceTimersByTime(61_000);
    reportAutosaveError(error, context);

    expect(Sentry.captureException).toHaveBeenCalledTimes(2);
  });

  it("gère une erreur réseau sans réponse HTTP", () => {
    const details = reportAutosaveError({ message: "Network Error" }, { mode: "translate" });

    expect(details.status).toBeNull();
    expect(details.fields).toEqual([]);
    expect(details.message).toBe("Network Error");
  });

  it("conserve le motif du refus renvoyé par la validation", () => {
    const details = reportAutosaveError(
      validationError(
        "body.translated.content",
        '"markdown" is an excess property and therefore is not allowed',
      ),
      { mode: "translate", dispositifId: "reason-1" },
    );

    expect(details.fieldDetails).toEqual([
      {
        path: "body.translated.content",
        reason: '"markdown" is an excess property and therefore is not allowed',
        excessProperty: "markdown",
        readableReason: "la donnée « markdown » n’est plus acceptée à cet endroit",
      },
    ]);
  });

  it("produit une référence exploitable même sans Sentry", () => {
    const details = reportAutosaveError(validationError("body.metadatas.sessions"), {
      mode: "edit",
      dispositifId: "ref-1",
    });

    expect(details.reference).toMatch(/^[0-9a-f]{32}$/);
  });

  it("réutilise la référence de la notification réellement partie", () => {
    const error = validationError("body.metadatas.sessions");
    const context = { mode: "edit" as const, dispositifId: "ref-2" };

    const first = reportAutosaveError(error, context);
    const second = reportAutosaveError(error, context);

    expect(second.reference).toBe(first.reference);
  });

  it("notifie l'équipe avec la référence affichée et les champs détaillés", () => {
    const details = reportAutosaveError(
      validationError("body.translated.content", "invalid object"),
      { mode: "translate", dispositifId: "slack-1", locale: "uk" },
    );

    expect(API.reportClientError).toHaveBeenCalledTimes(1);
    expect(API.reportClientError).toHaveBeenCalledWith(
      expect.objectContaining({
        reference: details.reference,
        source: "autosave-translate",
        status: 422,
        message: "Validation Failed",
        dispositifId: "slack-1",
        locale: "uk",
        fields: [
          {
            path: "body.translated.content",
            reason: "invalid object",
            excessProperty: undefined,
            readableReason: undefined,
          },
        ],
      }),
    );
  });

  it("ne notifie qu'une fois quand le même échec se répète", () => {
    const error = validationError("body.metadatas.sessions");
    const context = { mode: "edit" as const, dispositifId: "slack-2" };

    reportAutosaveError(error, context);
    reportAutosaveError(error, context);

    expect(API.reportClientError).toHaveBeenCalledTimes(1);
  });

  describe("message compréhensible", () => {
    it("explique qu'une donnée de la fiche n'est plus acceptée", () => {
      const details = reportAutosaveError(
        validationError(
          "body.translated.content",
          '"markdown" is an excess property and therefore is not allowed',
        ),
        { mode: "translate", dispositifId: "msg-1" },
      );

      expect(details.userMessage).toContain("l’éditeur ne sait plus enregistrer");
    });

    it("nomme la propriété fautive même noyée dans l'erreur d'union de tsoa", () => {
      const details = reportAutosaveError(
        validationError("body.translated.content", UNION_EXCESS_MESSAGE),
        { mode: "translate", dispositifId: "msg-union" },
      );

      expect(details.fieldDetails[0].excessProperty).toBe("markdown");
      expect(details.userMessage).toContain("« markdown »");
      expect(details.userMessage).toContain("aucun caractère n’est en cause");
    });

    it("annonce le volume envoyé et le plafond sur un 413", () => {
      const details = reportAutosaveError(
        {
          response: { status: 413, data: { message: "Payload Too Large" } },
          config: { data: "x".repeat(3 * 1024 * 1024) },
        },
        { mode: "edit", dispositifId: "msg-413" },
      );

      expect(details.payloadSize).toEqual({ bytes: 3145728, limitBytes: 52428800 });
      expect(details.userMessage).toContain("Volume envoyé : 3 Mo");
      expect(details.userMessage).toContain("maximum accepté : 50 Mo");
    });

    it("parle de connexion quand il n'y a pas de réponse HTTP", () => {
      const details = reportAutosaveError({ message: "Network Error" }, { mode: "edit" });

      expect(details.userMessage).toContain("connexion");
    });

    it("reste muet sur un statut qu'on ne sait pas interpréter", () => {
      const details = reportAutosaveError(
        { response: { status: 418, data: { message: "I am a teapot" } } },
        { mode: "edit", dispositifId: "msg-2" },
      );

      expect(details.userMessage).toBeNull();
    });
  });
});

describe("formatBytes", () => {
  it.each([
    [512, "512 o"],
    [2048, "2 ko"],
    [1_572_864, "1,5 Mo"],
    [52_428_800, "50 Mo"],
  ])("formate %i en %s", (bytes, expected) => {
    expect(formatBytes(bytes)).toBe(expected);
  });
});
