import * as Sentry from "@sentry/nextjs";
import { reportAutosaveError } from "./autosaveError";

jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(() => "event-id"),
  withScope: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

const buildScope = () => ({ setTag: jest.fn(), setContext: jest.fn() });

const validationError = (field: string) => ({
  response: {
    status: 422,
    data: { message: "Validation Failed", data: { [field]: { message: "invalid object" } } },
  },
});

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
});
