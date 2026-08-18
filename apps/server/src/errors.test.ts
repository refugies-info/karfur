import type { Request, Response } from "express";
import logger from "~/logger";
import { ConflictError, serverErrorHandler } from "./errors";

jest.mock("~/logger", () => ({
  error: jest.fn(),
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
