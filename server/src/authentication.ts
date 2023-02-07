import { Request } from "express";
import jwt from "jwt-simple";
import { Config } from "src/types/interface";
import { UserModel } from "src/typegoose";
import { AuthenticationError } from "./errors";

let config: Config = {};
if (process.env.NODE_ENV === "dev") {
  config = require("./config/config");
}

export function expressAuthentication(
  request: Request,
  securityName: string,
  roles?: string[]
): Promise<any> {
  if (securityName === "fromSite") { // FIXME : does not work
    if (!request.fromSite) throw new AuthenticationError("Requête bloquée par API");
  }
  if (securityName === "jwt") {
    const token = (request.headers["authorization"] || request.headers["x-access-token"]) as string;

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new AuthenticationError("No token found."));
      }
      const decoded = jwt.decode(token, process.env.NODE_ENV === "dev" ? config.secret : process.env.SECRET);
      if (!decoded) {
        reject(new AuthenticationError("No user found."));
      }
      UserModel.findById(decoded._id)
        .populate("roles")
        .then((user) => {
          if (!user) reject(new AuthenticationError("No user found."));
          request.userId = user._id;
          request.user = user;

          if (roles.length > 0) {
            if (roles?.includes("admin") && !user.hasRole("Admin")) {
              reject(new AuthenticationError("Not allowed."));
            }
            if (roles?.includes("expert") && (!user.hasRole("ExpertTrad") || !user.hasRole("Admin"))) {
              reject(new AuthenticationError("Not allowed."));
            }
          }

          resolve(true);
        })
        .catch(() => {
          reject(new Error("There was a problem finding the user."));
        });
    });
  }
}
