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
  data: any | undefined;
  status: number;

  constructor(message: string, code?: string, data?: any) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

export class InternalError extends APIError {
  status = 500;
}

export class UnauthorizedError extends APIError {
  status = 401;
}

export class AuthenticationError extends APIError {
  status = 403;
}

export class NotFoundError extends APIError {
  status = 404;
}

export class InvalidRequestError extends APIError {
  status = 400;
}

/**
 * Returns the right error code depending on the type of the error
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const serverErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): Response | void => {
  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV !== "production") console.error(err);

  if (err instanceof ValidateError) {
    logger.error("[serverErrorHandler] Validation failed", {
      status: 422,
      path: req.url,
      fields: err.fields,
    })
    return res.status(422).json({
      message: "Validation Failed",
      data: err.fields,
    });
  }

  if (err instanceof APIError) {
    logger.error(`[serverErrorHandler] ${err.message}`, {
      status: err.status,
      path: req.url,
      error: err.message,
      data: err.data,
    })

    return res.status(err.status).json({
      message: err.message,
      code: err.code,
      data: err.data
    });
  }

  if (err instanceof Error) {
    logger.error("[serverErrorHandler] Unknown error", {
      status: 500,
      path: req.url,
      error: err,
    })
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }

  next();
};
