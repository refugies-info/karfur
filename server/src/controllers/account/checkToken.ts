import { NextFunction, Request, Response } from "express";
import { RoleModel, UserId, UserModel } from "src/typegoose";

import jwt from "jwt-simple";
import logger from "../../logger";

export interface CustomRequest extends Request {
  userId?: UserId;
}

/**
 * @deprecated
 * @param req
 * @returns
 */
const getTokenFromRequest = (req: Request): string =>
  (req.headers["authorization"] || req.headers["x-access-token"]) as string;

/**
 *
 * @deprecated
 * @param req
 * @param res
 * @param next
 * @returns
 */
const check = (req: Request, res: Response, next: NextFunction) => {
  let token = getTokenFromRequest(req);

  if (!token || token === null || token === undefined || token === "undefined")
    return res.status(403).send({ auth: false, message: "No token found." });

  let decoded = jwt.decode(token, process.env.SECRET);

  if (!decoded || decoded === null || decoded === undefined || decoded === "undefined")
    return res.status(404).send({ auth: false, message: "No user found." });

  UserModel.findById(decoded._id)
    .populate("roles selectedLanguages")
    .then((user) => {
      if (!user) return res.status(404).send({ auth: false, message: "No user found." });
      req.userId = user._id;
      req.user = user;
      next();
    })
    .catch(() => {
      return res.status(500).send({
        auth: false,
        message: "There was a problem finding the user.",
      });
    });
};

/**
 * @deprecated
 * @param req
 * @param res
 * @param next
 */
const getId = (req: Request, res: Response, next: NextFunction) => {
  let token = getTokenFromRequest(req);

  req.userId = undefined;
  if (token !== null && token !== undefined && token !== "undefined") {
    let decoded = jwt.decode(token, process.env.SECRET);
    if (decoded) {
      UserModel.findById(decoded._id)
        .populate("roles")
        .exec(function (err, user) {
          if (err || !user) return;
          req.userId = user._id;
          req.user = user;
          next();
        });
    } else {
      next();
    }
  } else {
    next();
  }
};

/**
 * @deprecated
 * @param req
 * @param res
 * @param next
 */
const getRoles = (req: Request, res: Response, next: NextFunction) => {
  RoleModel.find({}).exec(function (err, roles) {
    if (err) {
      logger.error("error in getRoles", { error: err.message });
    }
    req.roles = roles;
    next();
  });
};

export { check, getId, getRoles };
