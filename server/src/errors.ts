import { ValidateError } from "tsoa";
import {
  Response,
  Request,
  NextFunction,
} from "express";

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

export class AuthenticationError extends Error { }

export class NotFoundError extends Error { }

/**
 * Returns the right error code depending on the type of the error
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const serverErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof AuthenticationError) {
    return res.status(403).json({
      message: err.message,
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      message: err.message,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }

  next();
}
