import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import logger from "~/logger";

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
  data: unknown | undefined;
  status: number;

  constructor(message: string, code?: string, data?: unknown) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

export class InternalError extends APIError {
  status = 500;
}

export class ServiceUnavailableError extends APIError {
  status = 503;
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

export class ConflictError extends APIError {
  status = 409;
}

const getErrorStatus = (err: Error): number => {
  const error = err as { status?: number; statusCode?: number };
  if (typeof error.status === "number" && error.status >= 400 && error.status < 600)
    return error.status;

  const statusCode = error.statusCode;
  if (typeof statusCode === "number" && statusCode >= 400 && statusCode < 600) return statusCode;

  return 500;
};

/**
 * Returns the right error code depending on the type of the error
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const serverErrorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV !== "production") console.error(err);

  if (err instanceof ValidateError) {
    logger.error("[serverErrorHandler] Validation failed", {
      status: 422,
      path: req.url,
      fields: err.fields,
    });
    res.status(422).json({
      message: "Validation Failed",
      data: err.fields,
    });
    return;
  }

  if (err instanceof APIError) {
    logger.error(`[serverErrorHandler] ${err.message}`, {
      status: err.status,
      path: req.url,
      error: err.message,
      data: err.data,
    });

    res.status(err.status).json({
      message: err.message,
      code: err.code,
      data: err.data,
    });
    return;
  }

  if (err instanceof Error) {
    const status = getErrorStatus(err);
    // `message` and `stack` are non-enumerable on Error, so logging `err`
    // directly serializes to `{}` and loses the diagnosis entirely.
    logger.error("[serverErrorHandler] Unknown error", {
      status,
      path: req.url,
      error: err.message,
      errorName: err.name,
      stack: err.stack,
    });
    res.status(status).json({
      message: err.message || "Internal Server Error",
    });
    return;
  }

  next();
};
