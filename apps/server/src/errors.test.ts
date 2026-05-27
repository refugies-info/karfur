import type { Request, Response } from "express";
import logger from "~/logger";
import { serverErrorHandler } from "./errors";

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
      error: err,
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "stream ended unexpectedly" });
    expect(next).not.toHaveBeenCalled();
  });
});
