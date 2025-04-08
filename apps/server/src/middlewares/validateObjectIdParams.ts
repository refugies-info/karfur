import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

// List of parameter names that should be validated as MongoDB ObjectIds
const OBJECT_ID_PARAMS = ["id", "suggestionId"]; // Add other param names if needed

/**
 * Middleware to validate if specific URL parameters are valid MongoDB ObjectIds.
 * If validation fails for any relevant parameter, it sends a 404 Not Found response.
 */
export const validateObjectIdParams = (req: Request, res: Response, next: NextFunction): void => {
  for (const paramName of OBJECT_ID_PARAMS) {
    if (req.params[paramName]) {
      const paramValue = req.params[paramName];
      if (!mongoose.Types.ObjectId.isValid(paramValue)) {
        // Send 404 directly as requested
        res.status(404).send({ message: "Resource not found due to invalid ID format" });
        return; // Stop further processing
      }
    }
  }
  next(); // All relevant params are valid or not present, proceed to the next middleware/handler
};
