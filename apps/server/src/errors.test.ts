import * as Sentry from "@sentry/node";
import type { Request, Response } from "express";
import { ValidateError } from "tsoa";
import logger from "~/logger";
import {
  ConflictError,
  InvalidRequestError,
  NotFoundError,
  serverErrorHandler,
  UnauthorizedError,
} from "./errors";

jest.mock("~/logger", () => ({
  error: jest.fn(),
}));

jest.mock("@sentry/node", () => ({
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  withScope: jest.fn((cb: (scope: unknown) => void) =>
    cb({ setLevel: jest.fn(), setTag: jest.fn(), setContext: jest.fn() }),
  ),
}));

const buildResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

describe("serverErrorHandler", () => {
  const nodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = "production";
  });

  afterAll(() => {
    process.env.NODE_ENV = nodeEnv;
  });

  it("preserves HTTP 4xx status from generic request parsing errors", () => {
    const err = Object.assign(new Error("stream ended unexpectedly"), { statusCode: 400 });
    const req = { url: "/" } as Request;
    const res = buildResponse();
    const next = jest.fn();

    serverErrorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith("[serverErrorHandler] Unknown error", {
      status: 400,
      path: "/",
      error: "stream ended unexpectedly",
      errorName: "Error",
      stack: err.stack,
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "stream ended unexpectedly" });
    expect(next).not.toHaveBeenCalled();
  });

  it("logs the stack of an unknown error instead of a non serializable Error object", () => {
    const err = new TypeError("Cannot read properties of undefined (reading 'includes')");
    const req = { url: "/dispositifs/with-translations-status" } as Request;

    serverErrorHandler(err, req, buildResponse(), jest.fn());

    const [, meta] = (logger.error as jest.Mock).mock.calls[0];
    expect(meta.status).toEqual(500);
    expect(meta.errorName).toEqual("TypeError");
    expect(meta.error).toEqual("Cannot read properties of undefined (reading 'includes')");
    expect(meta.stack).toContain("TypeError");
    // The whole point: JSON.stringify(new Error()) is "{}", so the raw object must not be logged.
    expect(JSON.stringify(meta)).toContain("errors.test.ts");
  });

  it("answers 409 on a ConflictError", () => {
    const err = new ConflictError("Dispositif is already translated in uk");
    const req = { url: "/traduction" } as Request;
    const res = buildResponse();

    serverErrorHandler(err, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Dispositif is already translated in uk",
      code: undefined,
      data: undefined,
    });
  });
});

/**
 * `Sentry.setupExpressErrorHandler` filtre sur `status >= 500`, donc tout le reste doit être
 * remonté explicitement — c'est ce silence qui a laissé passer le 422 sur `metadatas.sessions`.
 */
describe("serverErrorHandler - remontée Sentry", () => {
  const nodeEnv = process.env.NODE_ENV;
  const req = { url: "/dispositifs/1", method: "PATCH" } as Request;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = "production";
  });

  afterAll(() => {
    process.env.NODE_ENV = nodeEnv;
  });

  it("remonte une erreur de validation 422", () => {
    const err = new ValidateError({ "body.metadatas.sessions": { message: "invalid" } }, "");

    serverErrorHandler(err, req, buildResponse(), jest.fn());

    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      expect.stringContaining("body.metadatas.sessions"),
    );
  });

  it("remonte les 4xx qui trahissent un bug", () => {
    serverErrorHandler(new InvalidRequestError("bad"), req, buildResponse(), jest.fn());
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);

    serverErrorHandler(new ConflictError("conflict"), req, buildResponse(), jest.fn());
    expect(Sentry.captureException).toHaveBeenCalledTimes(2);
  });

  it("ignore les statuts du trafic normal", () => {
    serverErrorHandler(new UnauthorizedError("nope"), req, buildResponse(), jest.fn());
    serverErrorHandler(new NotFoundError("absent"), req, buildResponse(), jest.fn());

    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it("laisse les 5xx au handler express pour éviter les doublons", () => {
    serverErrorHandler(new TypeError("boom"), req, buildResponse(), jest.fn());

    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it("remonte un throw qui n'est pas une Error", () => {
    const next = jest.fn();

    serverErrorHandler("chaine jetee", req, buildResponse(), next);

    expect(Sentry.captureMessage).toHaveBeenCalledWith(expect.stringContaining("Non-Error thrown"));
    expect(next).toHaveBeenCalled();
  });
});
