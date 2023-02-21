import { ValidateError } from "tsoa";
import { Response, Request, NextFunction } from "express";
import logger from "./logger";
export class RefactorTodoError extends Error {
  constructor() {
    super("Refactor TODO");
  }
}

export class MustBePopulatedError extends Error {
  constructor(property: string) {
    super(`${property} must be populated`);
  }
}

// API Errors
class APIError extends Error {
  code: string | undefined;
  data: string | undefined;

  constructor(message: string, code?: string, data?: string) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

export class UnauthorizedError extends APIError { }

export class AuthenticationError extends APIError { }

export class NotFoundError extends APIError { }

export class InvalidRequestError extends APIError { }

/**
 * Returns the right error code depending on the type of the error
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const serverErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): Response | void => {
  logger.error("[serverErrorHandler]", { path: req.path, error: (err as any).message })
  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV !== "production") console.error(err);

  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof AuthenticationError) {
    return res.status(403).json({
      message: err.message,
      code: err.code,
      data: err.data
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      message: err.message,
      code: err.code,
      data: err.data
    });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      message: err.message,
      code: err.code,
      data: err.data
    });
  }
  if (err instanceof InvalidRequestError) {
    return res.status(400).json({
      message: err.message,
      code: err.code,
      data: err.data
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }

  next();
};
