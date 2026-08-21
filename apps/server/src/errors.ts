import * as Sentry from "@sentry/node";
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

/**
 * Statuts qui font partie du trafic normal : les remonter noierait Sentry.
 */
const SILENT_STATUSES = new Set([401, 403, 404]);

/**
 * `Sentry.setupExpressErrorHandler` ne remonte que les erreurs dont le statut est >= 500
 * (`defaultShouldHandleError`), donc tout le reste restait invisible — c'est ainsi que le 422
 * sur `metadatas.sessions` est passé inaperçu pendant des mois. On capture ici les 4xx qui
 * trahissent un bug, en laissant les 5xx au handler express pour éviter les doublons.
 */
const captureBelow500 = (
  err: Error,
  req: Request,
  status: number,
  extra: Record<string, unknown> = {},
) => {
  if (status >= 500 || SILENT_STATUSES.has(status)) return;

  Sentry.withScope((scope) => {
    scope.setLevel("warning");
    scope.setTag("http.status_code", String(status));
    scope.setContext("request", { path: req.url, method: req.method, ...extra });
    Sentry.captureException(err);
  });
};

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
      method: req.method,
      fields: err.fields,
    });
    // Sentry's express handler only reports 5xx, but a 422 means a client sends a payload the
    // API can no longer accept (eg. a not-yet-migrated document) - we want to know about it.
    Sentry.withScope((scope) => {
      scope.setLevel("warning");
      scope.setTag("error.type", "validation");
      scope.setTag("http.status_code", "422");
      scope.setContext("validation", { path: req.url, method: req.method, fields: err.fields });
      const invalidFields = Object.keys(err.fields || {});
      if (invalidFields.length > 0) scope.setTag("validation.field", invalidFields[0]);
      Sentry.captureMessage(
        `Validation failed: ${req.method} ${req.url} [${invalidFields.join(", ")}]`,
      );
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

    captureBelow500(err, req, err.status, { code: err.code, data: err.data });

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
    captureBelow500(err, req, status);

    res.status(status).json({
      message: err.message || "Internal Server Error",
    });
    return;
  }

  // Un throw qui n'est pas une Error : toujours un bug, et le handler express l'ignore.
  logger.error("[serverErrorHandler] Non-Error thrown", { path: req.url, thrown: String(err) });
  Sentry.withScope((scope) => {
    scope.setTag("error.type", "non-error-thrown");
    // `err` est passé tel quel : String() aplatirait un objet en "[object Object]".
    scope.setContext("request", { path: req.url, method: req.method, thrown: err });
    Sentry.captureMessage(`Non-Error thrown: ${req.method} ${req.url}`);
  });

  next();
};
